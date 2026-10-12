import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Trees,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export const IssueCard = ({ complaint, onLocateOnMap }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Roads & Footpaths':
        return Construction;
      case 'Waste Management':
        return Trash2;
      case 'Drainage & Water':
        return Droplets;
      case 'Street Lighting':
        return Lightbulb;
      case 'Parks & Trees':
        return Trees;
      default:
        return ShieldAlert;
    }
  };

  const CategoryIcon = getCategoryIcon(complaint.category);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'LOW':
        return 'bg-slate-900 text-slate-400 border-slate-800';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
    }
  };

  const formattedDate = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  const photoUrl =
    complaint.photos && complaint.photos.length > 0
      ? complaint.photos[0].url || complaint.photos[0]
      : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl hover:border-brand-500/80 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="p-4 pb-3 flex items-start justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-800/60">
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {complaint.category}
              </span>
              <div className="font-mono text-xs font-black text-brand-400">
                {complaint.ticketId}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={complaint.status} size="sm" />
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityStyle(
                complaint.priority
              )}`}
            >
              {complaint.priority}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {photoUrl && (
            <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group-hover:opacity-95 transition-opacity">
              <img
                src={photoUrl}
                alt={complaint.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          )}

          <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1 text-sm leading-snug">
            {complaint.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {complaint.description}
          </p>

          <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="truncate">{complaint.location?.address || 'City Area'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formattedDate}
              </span>
              {complaint.location?.wardOrZone && (
                <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {complaint.location.wardOrZone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-[#030712] border-t border-slate-800 flex items-center justify-between gap-2">
        {onLocateOnMap && (
          <button
            type="button"
            onClick={() => onLocateOnMap(complaint)}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-brand-400" />
            Show on Map
          </button>
        )}

        <Link
          to={`/track?id=${complaint.ticketId}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline transition-all"
        >
          Track Progress
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default IssueCard;
