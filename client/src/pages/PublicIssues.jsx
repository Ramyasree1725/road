import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  List,
  Layers,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import IssueCard from '../components/IssueCard';
import PublicMap from '../components/PublicMap';

export const PublicIssues = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map' | 'list'
  const [activeComplaint, setActiveComplaint] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, [selectedCategory, selectedStatus]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (searchTerm) params.append('search', searchTerm);

      const res = await api.getPublicComplaints(params.toString());
      if (res.success && res.complaints) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error('Error fetching public issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const categories = [
    'All',
    'Roads & Footpaths',
    'Waste Management',
    'Drainage & Water',
    'Street Lighting',
    'Parks & Trees',
    'Public Health',
  ];

  const statuses = ['All', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

  const filtered = complaints.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchTitle = c.title?.toLowerCase().includes(s);
      const matchAddress = c.location?.address?.toLowerCase().includes(s);
      const matchTicket = c.ticketId?.toLowerCase().includes(s);
      if (!matchTitle && !matchAddress && !matchTicket) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Citywide Issue Observability
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Public Civic Issues & Live Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore reported civic infrastructure challenges across municipal wards. Contact data is anonymized for privacy.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Full Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cards Only
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by area, landmark, title or ticket ID..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
            />
          </form>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold focus:outline-none"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'map' && (
        <div className="h-[650px] w-full">
          <PublicMap
            complaints={filtered}
            selectedComplaint={activeComplaint}
            onSelectComplaint={(c) => setActiveComplaint(c)}
          />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <IssueCard key={item._id || item.ticketId} complaint={item} />
          ))}
        </div>
      )}

      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Issue Cards Column */}
          <div className="lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>Showing {filtered.length} public reports</span>
              <span>Click card to center map</span>
            </div>

            {loading ? (
              <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-400">
                Loading live civic reports...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-500">
                No civic issues match your current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item._id || item.ticketId}
                    onClick={() => setActiveComplaint(item)}
                    className="cursor-pointer"
                  >
                    <IssueCard
                      complaint={item}
                      onLocateOnMap={(c) => setActiveComplaint(c)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live OpenStreetMap Column */}
          <div className="lg:col-span-6 sticky top-24 h-[700px]">
            <PublicMap
              complaints={filtered}
              selectedComplaint={activeComplaint}
              onSelectComplaint={(c) => setActiveComplaint(c)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicIssues;
