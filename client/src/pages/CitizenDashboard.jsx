import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  Activity,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Filter,
  Eye,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0,
    reopened: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getMyComplaints();
      if (res.success) {
        setComplaints(res.complaints || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'IN_PROGRESS') return ['ASSIGNED', 'IN_PROGRESS', 'VERIFIED'].includes(c.status);
    if (statusFilter === 'RESOLVED') return ['RESOLVED', 'CLOSED'].includes(c.status);
    return c.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-md">
        <div>
          <span className="text-xs font-bold text-brand-300 uppercase tracking-widest">
            Citizen Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {user?.name || 'Proactive Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            Track your submitted civic issues, follow field repair progress, and verify work completion.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-emerald-950 bg-white hover:bg-emerald-50 shadow-md transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-brand-700" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Filed
            </span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-3">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Grievances registered</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-700 font-mono mt-3">
            {stats.submitted}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting verification</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono mt-3">
            {stats.inProgress}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Field staff on ground</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolved & Done
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono mt-3">
            {stats.resolved}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Completed solutions</div>
        </div>
      </div>

      {/* Complaints Table & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              My Registered Complaints
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live list of all civic requests tied to your citizen account
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['ALL', 'SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'REOPENED'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setStatusFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === filterKey
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {filterKey.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Listing */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading your reports...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No complaints found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't filed any complaints under this filter status yet. Notice a problem in your street?
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div
                key={item._id || item.ticketId}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {item.ticketId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                    <span>📍 {item.location?.address}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.assignedStaff?.name && (
                      <span className="text-emerald-700 font-medium">
                        🛠️ {item.assignedStaff.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/track?id=${item.ticketId}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Track</span>
                  </Link>

                  {item.status === 'RESOLVED' && (
                    <Link
                      to={`/track?id=${item.ticketId}`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
