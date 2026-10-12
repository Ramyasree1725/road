import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, AlertTriangle, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Civic<span className="text-brand-400">Fix</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering proactive citizens and municipal authorities to bridge urban infrastructure gaps through transparent digital reporting and resolution tracking.
            </p>
            <div className="text-[11px] text-brand-400 font-semibold tracking-wide">
              Report It. Track It. Improve Your City.
            </div>
          </div>

          {/* Citizen Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Citizen Portal</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/report" className="hover:text-brand-400 transition-colors">
                  Report a Civic Issue
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-brand-400 transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/issues" className="hover:text-brand-400 transition-colors">
                  Public Issues Feed & Map
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">
                  Citizen Activity Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal Administration */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Governance</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/admin" className="hover:text-brand-400 transition-colors">
                  Admin Analytics & Triage
                </Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-brand-400 transition-colors">
                  Field Staff Taskforce
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  Workflow Guidelines & SLAs
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-brand-400 transition-colors">
                  Department Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Safety Notice */}
          <div className="space-y-2.5 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Emergency Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              CivicFix is designed for non-emergency municipal maintenance. For active gas leaks, building collapses, fires, or life-threatening hazards, call emergency helplines immediately.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs font-mono font-bold text-emerald-400">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3 h-3" /> Police/Fire: 112
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3 h-3" /> Ambulance: 108
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} CivicFix Platform. Smart City Municipal Issue Tracking System.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Better Cities by Ramya Sri</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
