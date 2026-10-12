import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  Activity,
  Upload,
  AlertCircle,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingAction: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  // Update Work Progress Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [workNote, setWorkNote] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState('');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getStaffTasks();
      if (res.success) {
        setTasks(res.tasks || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching staff tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdate = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'RESOLVED');
    setWorkNote('');
    setEvidencePhotoUrl(
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    );
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmittingUpdate(true);

    try {
      await api.updateStaffProgress(selectedTask._id || selectedTask.ticketId, {
        status: newStatus,
        note: workNote || `Field work updated to ${newStatus} by field team`,
        evidencePhotoUrl: newStatus === 'RESOLVED' ? evidencePhotoUrl : '',
      });

      alert(`Work order ${selectedTask.ticketId} updated successfully.`);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Error updating task progress');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Update Progress Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {selectedTask.ticketId}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Record On-Ground Work Progress
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border">
                <div className="font-bold text-slate-800">{selectedTask.title}</div>
                <div className="text-slate-500 mt-0.5">📍 {selectedTask.location?.address}</div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Progress Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="IN_PROGRESS">IN_PROGRESS (Work Commenced)</option>
                  <option value="RESOLVED">RESOLVED (Repairs Completed & Tested)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Work Notes & Action Log
                </label>
                <textarea
                  rows={3}
                  required
                  value={workNote}
                  onChange={(e) => setWorkNote(e.target.value)}
                  placeholder="e.g. Patching complete with hot bituminous binder. Road leveled and barricades removed."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {newStatus === 'RESOLVED' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-emerald-800 mb-1">
                    Completion Evidence Photo URL
                  </label>
                  <input
                    type="url"
                    value={evidencePhotoUrl}
                    onChange={(e) => setEvidencePhotoUrl(e.target.value)}
                    placeholder="https://... photo link of repaired site"
                    className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/40 text-slate-800 focus:outline-none"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    A completion photo is required for citizen verification and sign-off.
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUpdate}
                  className="px-5 py-2 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  {submittingUpdate ? 'Updating...' : 'Submit Work Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Field Force Portal
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Municipal Field Staff Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <span className="font-bold text-slate-800">{user?.name || 'Field Officer'}</span>. Manage assigned work orders and upload verification photos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            Field Ready
          </span>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Work Orders
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {stats.totalAssigned}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Pending Action
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono mt-2">
            {stats.pendingAction}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Work in Progress
          </div>
          <div className="text-3xl font-black text-blue-700 font-mono mt-2">
            {stats.inProgress}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Resolved by Me
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono mt-2">
            {stats.resolved}
          </div>
        </div>
      </div>

      {/* Tasks Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">
            Assigned Field Work Orders
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an order to inspect location, add field progress logs, and upload completion proof
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div
              key={task._id || task.ticketId}
              className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {task.ticketId}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {task.category}
                  </span>
                  <StatusBadge status={task.status} size="sm" />
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      task.priority === 'CRITICAL'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {task.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    {task.location?.address}
                  </span>
                  {task.location?.landmark && (
                    <span>Landmark: {task.location.landmark}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenUpdate(task)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Update Work / Complete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
