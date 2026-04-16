/**
 * Offline-first sync queue with conflict metadata.
 */

const DB_NAME = 'dispatch-sync-db';
const STORE = 'pending_actions';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('status', 'status');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function queueAction(actionType, entity, payload, baseServerUpdatedAt = null) {
  const db = await openDb();
  const record = {
    actionType,
    entity,
    payload,
    baseServerUpdatedAt,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString(),
    lastError: null,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = () => reject(tx.error);
  });
}

async function listPending() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const all = req.result || [];
      resolve(all.filter((r) => r.status === 'pending'));
    };
    req.onerror = () => reject(req.error);
  });
}

async function updateRecord(id, updater) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const next = updater(getReq.result);
      store.put(next);
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function removeRecord(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flushQueue(handlerMap, { onProgress } = {}) {
  const queue = await listPending();
  for (const record of queue) {
    const handler = handlerMap[record.actionType];
    if (!handler) continue;

    try {
      const result = await handler(record);
      if (result?.conflict) {
        await updateRecord(record.id, (r) => ({
          ...r,
          status: 'conflict',
          conflict: result.conflict,
          attempts: r.attempts + 1,
        }));
      } else {
        await removeRecord(record.id);
      }
      onProgress?.({ id: record.id, status: result?.conflict ? 'conflict' : 'synced' });
    } catch (error) {
      await updateRecord(record.id, (r) => ({
        ...r,
        attempts: r.attempts + 1,
        lastError: error?.message || String(error),
      }));
      onProgress?.({ id: record.id, status: 'retry' });
      break;
    }
  }
}
