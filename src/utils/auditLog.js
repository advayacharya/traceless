/**
 * Audit Log — Tracks every local operation to prove zero network uploads.
 * Stores entries in-memory only (dies with the session).
 */

const LOG_ENTRIES = [];

/**
 * @typedef {Object} AuditEntry
 * @property {string} id
 * @property {number} timestamp
 * @property {'FILE_READ'|'EXIF_PARSE'|'CANVAS_STRIP'|'BLOB_EXPORT'|'ZIP_BUNDLE'|'DOWNLOAD'|'HASH_COMPUTE'|'GPS_DETECTED'|'NO_GPS'} type
 * @property {string} detail
 * @property {'local'} scope - Always 'local', proving no network activity
 */

let _nextId = 0;
let _listeners = [];

/**
 * Logs an audit entry.
 * @param {string} type
 * @param {string} detail
 * @returns {AuditEntry}
 */
export function logAudit(type, detail) {
  const entry = {
    id: `audit-${_nextId++}`,
    timestamp: Date.now(),
    type,
    detail,
    scope: 'local',
  };
  LOG_ENTRIES.push(entry);
  _listeners.forEach((fn) => fn([...LOG_ENTRIES]));
  return entry;
}

/**
 * Returns a snapshot of all audit entries.
 * @returns {AuditEntry[]}
 */
export function getAuditLog() {
  return [...LOG_ENTRIES];
}

/**
 * Clears all audit entries.
 */
export function clearAuditLog() {
  LOG_ENTRIES.length = 0;
  _listeners.forEach((fn) => fn([]));
}

/**
 * Subscribes to audit log changes.
 * @param {Function} listener
 * @returns {Function} unsubscribe
 */
export function subscribeAuditLog(listener) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((fn) => fn !== listener);
  };
}
