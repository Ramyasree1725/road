import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  UserCheck,
  AlertCircle,
  RotateCcw,
  Star,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export const TrackIssue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketIdInput, setTicketIdInput] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reopen modal state
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopening, setReopening] = useState(false);

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fetchComplaint = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.trackComplaint(idToSearch.trim());
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
        setUpdates(res.updates || res.complaint.updates || []);
      }
    } catch (err) {
      setComplaint(null);
      setError(err.message || `No complaint found with ID ${idToSearch}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTicketIdInput(idFromUrl);
      fetchComplaint(idFromUrl);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (ticketIdInput.trim()) {
      setSearchParams({ id: ticketIdInput.trim().toUpperCase() });
      fetchComplaint(ticketIdInput.trim());
    }
  };

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    setReopening(true);
    try {
      const res = await api.reopenComplaint(complaint._id || complaint.ticketId, reopenReason);
      if (res.success) {
        alert('Complaint has been reopened. Municipal staff will re-inspect.');
        setReopenModalOpen(false);
        fetchComplaint(complaint.ticketId);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setReopening(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitFeedback(complaint._id || complaint.ticketId, {
        rating: feedbackRating,
        comment: feedbackComment,
      });
      if (res.success) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Status steps mapping
  const steps = [
    { key: 'SUBMITTED', label: 'Reported', desc: 'Registered in database' },
    { key: 'VERIFIED', label: 'Verified', desc: 'Triage & location checked' },
    { key: 'ASSIGNED', label: 'Assigned', desc: 'Routed to ward staff' },
    { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Field repair commenced' },
    { key: 'RESOLVED', label: 'Resolved', desc: 'Completion proof uploaded' },
  ];

  const getStepStatus = (stepKey) => {
    if (!complaint) return 'upcoming';

    const order = ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentIndex = order.indexOf(complaint.status);
    const stepIndex = order.indexOf(stepKey);

    if (complaint.status === 'REOPENED') {
      if (stepKey === 'RESOLVED') return 'reopened';
      return 'completed';
    }

    if (currentIndex >= stepIndex) {
      return currentIndex === stepIndex ? 'current' : 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Reopen Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
              <RotateCcw className="w-5 h-5" />
              <span>Reopen This Complaint</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If the on-ground issue was not properly solved or the problem recurred, explain the reason below. The municipal supervisor will review your feedback.
            </p>
            <textarea
              rows={3}
              required
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. Pothole was only partially filled with loose gravel and washed out again in rain..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReopenModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReopen}
                disabled={reopening}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                {reopening ? 'Reopening...' : 'Confirm Reopen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Public Verification & Transparency
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Track Municipal Complaint Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your unique Tracking Ticket ID (e.g. <span className="font-mono font-bold text-brand-700">CF-2026-1011</span>) to see live progress notes, assigned field officers, and completion photos.
        </p>

        {/* Input form */}
        <form onSubmit={handleSearchSubmit} className="pt-2 flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value)}
              placeholder="Enter Ticket ID (e.g. CF-2026-1011)"
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-600/25 transition-all"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Quick Demo Ticket Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <span>Try demo tickets:</span>
          {['CF-2026-1011', 'CF-2026-1012', 'CF-2026-1013', 'CF-2026-1014'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setTicketIdInput(demoId);
                setSearchParams({ id: demoId });
                fetchComplaint(demoId);
              }}
              className="px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
            >
              {demoId}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Complaint Result Details */}
      {complaint && (
        <div className="space-y-6 animate-fade-in">
          {/* Card Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
                    {complaint.ticketId}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {complaint.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {complaint.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>

            {/* Lifecycle Progress Bar */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resolution Workflow Progress
              </div>
              <div className="grid grid-cols-5 gap-2">
                {steps.map((st, i) => {
                  const state = getStepStatus(st.key);
                  return (
                    <div key={i} className="space-y-2">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          state === 'completed'
                            ? 'bg-brand-600'
                            : state === 'current'
                            ? 'bg-amber-500 animate-pulse'
                            : state === 'reopened'
                            ? 'bg-rose-500'
                            : 'bg-slate-200'
                        }`}
                      />
                      <div className="hidden sm:block">
                        <div className="text-[11px] font-bold text-slate-800 leading-tight">
                          {st.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {st.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department and Location Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  Issue Location
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {complaint.location?.address}
                </div>
                {complaint.location?.landmark && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Landmark: {complaint.location.landmark}
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <Building className="w-3.5 h-3.5 text-brand-600" />
                  Assigned Department
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {complaint.department?.name || 'Municipal Triage Desk'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Code: {complaint.department?.code || 'GEN'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                  Field Officer Assigned
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {complaint.assignedStaff?.name || 'Awaiting Field Dispatch'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Priority: {complaint.priority}
                </div>
              </div>
            </div>

            {/* Before / After Photos */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Photo Evidence Inspection
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reported Photo */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Initial Citizen Report Photo
                  </span>
                  <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={
                        complaint.photos?.[0]?.url ||
                        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
                      }
                      alt="Initial report"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Resolution Evidence Photo (if available) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">
                    Field Completion Evidence
                  </span>
                  <div className="h-48 rounded-2xl overflow-hidden bg-slate-100 border border-emerald-200 flex items-center justify-center">
                    {complaint.resolutionEvidence && complaint.resolutionEvidence.length > 0 ? (
                      <img
                        src={complaint.resolutionEvidence[0].url}
                        alt="Resolution proof"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400 text-xs">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        Awaiting work completion proof from field crew
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reopen Action (If Resolved) */}
            {complaint.status === 'RESOLVED' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Has this issue been resolved to your satisfaction?
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    If the work is incomplete or sub-standard, you can request an immediate reopening.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReopenModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reopen Complaint
                </button>
              </div>
            )}

            {/* Citizen Feedback Form (If Resolved / Closed) */}
            {['RESOLVED', 'CLOSED'].includes(complaint.status) && !feedbackSubmitted && (
              <form onSubmit={handleFeedback} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Rate Municipal Response Quality
                  </h4>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share a quick review about the repair work (optional)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs"
                  >
                    Submit Citizen Rating
                  </button>
                </div>
              </form>
            )}

            {feedbackSubmitted && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Thank you! Your civic feedback has been logged into the municipal quality index.
              </div>
            )}
          </div>

          {/* Status Timeline History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              Official Audit Timeline & Work Notes
            </h3>

            <div className="space-y-4 pt-2 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {updates && updates.length > 0 ? (
                updates.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center shrink-0 z-10 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-brand-600" />
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.newStatus} size="sm" />
                          <span className="text-xs font-semibold text-slate-700">
                            by {item.updatedBy?.name} ({item.updatedBy?.role})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {item.note}
                      </p>
                      {item.evidencePhoto && (
                        <div className="mt-2 w-28 h-20 rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={item.evidencePhoto}
                            alt="Progress snapshot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 pl-8">
                  No subsequent timeline updates logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackIssue;
