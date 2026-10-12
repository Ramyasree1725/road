import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600" />
            In-App Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Status updates, triage alerts, and resolution notices for your complaints
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border text-xs text-slate-500">
          No notifications in your inbox.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`p-4 rounded-2xl border transition-all ${
                item.isRead ? 'bg-white border-slate-200' : 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600">{item.message}</p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono pt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                {item.ticketId && (
                  <Link
                    to={`/track?id=${item.ticketId}`}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-lg flex items-center gap-1 shadow-2xs"
                  >
                    <span>View Ticket</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
