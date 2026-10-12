import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Wrench,
  AlertTriangle,
  UserPlus,
  Filter,
  Search,
  Activity,
  Layers,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Triage Action Modal State
  const [activeModalComplaint, setActiveModalComplaint] = useState(null);
  const [modalStatus, setModalStatus] = useState('VERIFIED');
  const [modalPriority, setModalPriority] = useState('HIGH');
  const [modalStaff, setModalStaff] = useState('Ramesh Kumar (Roads Lead)');
  const [modalNote, setModalNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminComplaints(),
      ]);

      if (statsRes.success) setStats(statsRes);
      if (complaintsRes.success) setComplaints(complaintsRes.complaints || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTriage = (c) => {
    setActiveModalComplaint(c);
    setModalPriority(c.priority || 'MEDIUM');
    setModalStatus(c.status === 'SUBMITTED' ? 'VERIFIED' : 'ASSIGNED');
    setModalNote('');
  };

  const handleSaveTriage = async (e) => {
    e.preventDefault();
    if (!activeModalComplaint) return;
    setUpdating(true);

    try {
      if (modalStatus === 'ASSIGNED') {
        await api.assignStaff(activeModalComplaint._id || activeModalComplaint.ticketId, {
          staffName: modalStaff,
          note: modalNote || `Assigned to ${modalStaff}`,
        });
      } else {
        await api.updateAdminStatus(activeModalComplaint._id || activeModalComplaint.ticketId, {
          status: modalStatus,
          priority: modalPriority,
          note: modalNote || `Status updated to ${modalStatus} by Administrator`,
        });
      }

      alert(`Complaint ${activeModalComplaint.ticketId} updated successfully.`);
      setActiveModalComplaint(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Error updating complaint');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        c.title?.toLowerCase().includes(s) ||
        c.ticketId?.toLowerCase().includes(s) ||
        c.category?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Triage / Workflow Action Modal */}
      {activeModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {activeModalComplaint.ticketId}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Municipal Triage & Staff Assignment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTriage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Issue Title
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-800 font-semibold border">
                  {activeModalComplaint.title}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Transition Status
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="ASSIGNED">ASSIGNED (Route to staff)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              {modalStatus === 'ASSIGNED' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assign Field Staff Officer
                  </label>
                  <select
                    value={modalStaff}
                    onChange={(e) => setModalStaff(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Ramesh Kumar (Roads Lead)">Ramesh Kumar (Roads Lead)</option>
                    <option value="Sunita Devi (Sanitation Inspector)">Sunita Devi (Sanitation Inspector)</option>
                    <option value="P. Nageswara Rao (Water Works)">P. Nageswara Rao (Water Works)</option>
                    <option value="B. Ravinder (Lighting & Electric)">B. Ravinder (Lighting & Electric)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Official Administrative Note
                </label>
                <textarea
                  rows={3}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="e.g. Verified by Ward Engineer. Road crew dispatched with asphalt mixer..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setActiveModalComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  {updating ? 'Saving...' : 'Apply Transition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            City Governance Command Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Municipal Administrator Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify citizen submissions, route work orders to specialized field crews, and monitor urban SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Municipal Node
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Intake
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            {stats?.stats?.total || complaints.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all wards</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Pending Triage
          </div>
          <div className="text-3xl font-black text-blue-700 font-mono mt-2">
            {stats?.stats?.open || complaints.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length}
          </div>
          <div className="text-[11px] text-blue-500 mt-0.5">Requires verification</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            Active / Assigned
          </div>
          <div className="text-3xl font-black text-amber-700 font-mono mt-2">
            {stats?.stats?.active || complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS', 'REOPENED'].includes(c.status)).length}
          </div>
          <div className="text-[11px] text-amber-500 mt-0.5">Under field repair</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Resolved Issues
          </div>
          <div className="text-3xl font-black text-emerald-700 font-mono mt-2">
            {stats?.stats?.resolved || complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length}
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">Evidence verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Resolution Rate
          </div>
          <div className="text-3xl font-black text-brand-700 font-mono mt-2">
            {stats?.stats?.resolutionRate || 82}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">City SLA score</div>
        </div>
      </div>

      {/* Main Complaints Triage Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Complaints Management & Action Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review citizen reports, change priorities, and assign field teams
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REOPENED">REOPENED</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Problem & Category</th>
                <th className="py-3.5 px-4">Ward / Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-right">Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item._id || item.ticketId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-brand-700">
                    {item.ticketId}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.category}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-[180px]">
                    <div className="truncate">{item.location?.address}</div>
                    <div className="text-[10px] text-slate-400">{item.location?.wardOrZone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        item.priority === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {item.assignedStaff?.name || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenTriage(item)}
                      className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-xs transition-colors"
                    >
                      Triage / Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
