/**
 * Notifications Store — In-memory notification system for processing events.
 */

const NOTIFICATIONS = [];
let _listeners = [];
let _nextId = 0;

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {number} timestamp
 * @property {'info'|'success'|'warning'|'gps'} type
 * @property {string} message
 * @property {boolean} read
 */

/**
 * Pushes a new notification.
 * @param {'info'|'success'|'warning'|'gps'} type
 * @param {string} message
 */
export function pushNotification(type, message) {
  const notif = {
    id: `notif-${_nextId++}`,
    timestamp: Date.now(),
    type,
    message,
    read: false,
  };
  NOTIFICATIONS.unshift(notif); // newest first
  if (NOTIFICATIONS.length > 50) NOTIFICATIONS.pop();
  _listeners.forEach((fn) => fn([...NOTIFICATIONS]));
  return notif;
}

/**
 * Returns all notifications.
 * @returns {Notification[]}
 */
export function getNotifications() {
  return [...NOTIFICATIONS];
}

/**
 * Marks all notifications as read.
 */
export function markAllRead() {
  NOTIFICATIONS.forEach((n) => (n.read = true));
  _listeners.forEach((fn) => fn([...NOTIFICATIONS]));
}

/**
 * Returns count of unread notifications.
 * @returns {number}
 */
export function getUnreadCount() {
  return NOTIFICATIONS.filter((n) => !n.read).length;
}

/**
 * Subscribe to notification changes.
 * @param {Function} listener
 * @returns {Function} unsubscribe
 */
export function subscribeNotifications(listener) {
  _listeners.push(listener);
  return () => {
    _listeners = _listeners.filter((fn) => fn !== listener);
  };
}
