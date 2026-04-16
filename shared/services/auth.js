import { getSupabaseClient } from '../db.js';
import { getConfig } from '../config.js';

const SESSION_KEY = 'APP_MANAGED_SESSION';

function saveAppSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAppSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAppSession() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * App-managed login.
 * Uses Postgres RPC `app_login_with_pin` so office/admin can manage users in-app.
 */
export async function loginWithUsernamePin(username, pin) {
  const { orgId } = getConfig();
  if (!orgId) throw new Error('Missing ORG_ID.');
  if (!/^\d{4}$/.test(pin)) throw new Error('PIN must be exactly 4 digits.');

  const { data, error } = await getSupabaseClient().rpc('app_login_with_pin', {
    p_org_id: orgId,
    p_username: username,
    p_pin: pin,
  });

  if (error) throw new Error(error.message || 'Login failed.');
  const user = Array.isArray(data) ? data[0] : null;
  if (!user?.user_id) throw new Error('Invalid username or PIN.');

  const session = {
    userId: user.user_id,
    fullName: user.full_name,
    roleKey: user.role_key,
    orgId,
    loggedInAt: new Date().toISOString(),
  };
  saveAppSession(session);
  return session;
}
