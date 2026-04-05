import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, subscribeNotifications, markAllRead, getUnreadCount } from '../utils/notifications';

const TYPE_CONFIG = {
  info: { icon: 'info', color: 'text-primary' },
  success: { icon: 'check_circle', color: 'text-secondary' },
  warning: { icon: 'warning', color: 'text-tertiary' },
  gps: { icon: 'location_on', color: 'text-tertiary' },
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

/**
 * NotificationsDropdown — Bell icon dropdown showing processing notifications.
 */
export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());
  const [unread, setUnread] = useState(getUnreadCount());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeNotifications((notifs) => {
      setNotifications(notifs);
      setUnread(notifs.filter((n) => !n.read).length);
    });
    return unsub;
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      markAllRead();
      setUnread(0);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors relative"
      >
        notifications
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-tertiary text-on-tertiary-container text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container rounded-lg border border-outline-variant/20 shadow-2xl shadow-black/40 z-[80] overflow-hidden">
          <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-on-surface">Notifications</span>
            <span className="font-mono text-[10px] text-on-surface-variant">{notifications.length} total</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <span className="material-symbols-outlined text-outline-variant/30 text-3xl block mb-2">notifications_off</span>
                <p className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors ${
                      !notif.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <span className={`material-symbols-outlined text-sm mt-0.5 ${config.color}`}>{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] font-mono text-on-surface-variant/50 mt-1">{timeAgo(notif.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
