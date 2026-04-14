import React, { useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { formatRelativeTime } from '@app/shared-types';

export default function NotificationBell(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="notification-bell">
      <button className="bell-button" onClick={handleToggle}>
        <span className="bell-icon">Bell</span>
        {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">Mark all read</button>
            )}
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              notifications.slice(0, 10).map((notif: any) => (
                <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}
                  onClick={() => markAsRead(notif.id)}>
                  <span className="notification-title">{notif.title}</span>
                  <span className="notification-message">{notif.message}</span>
                  <span className="notification-time">{formatRelativeTime(notif.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
