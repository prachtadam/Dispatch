/**
 * Search helper used by dropdowns in tech + office apps.
 */

export function filterOptions(options, query, keys = ['name']) {
  const q = `${query || ''}`.trim().toLowerCase();
  if (!q) return options;
  return options.filter((item) =>
    keys.some((key) => `${item?.[key] || ''}`.toLowerCase().includes(q)),
  );
}

export function fieldsForCustomer(fields, customerId) {
  if (!customerId) return [];
  return fields.filter((field) =>
    field.customer_id === customerId ||
    field.customer_ref === customerId,
  );
}
