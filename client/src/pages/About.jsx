import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building2, Users2, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Smart City Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About CivicFix Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          CivicFix is a next-generation civic technology platform designed to transform traditional municipal grievance redressal into a transparent, collaborative, and data-driven ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-brand-50 text-brand-700 rounded-xl flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Citizen Empowerment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Giving every citizen a direct voice to document urban infrastructure failures with photos, GPS coordinates, and real-time status visibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Municipal Accountability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating bureaucratic bottlenecks with automated ticket routing, ward-level workload tracking, and SLA turnaround enforcement.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Verified Proof of Work</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No complaint is marked resolved without before-and-after photo verification uploaded by field crews and approved by citizens.
          </p>
        </div>
      </div>

      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 space-y-4">
        <h2 className="text-2xl font-black">Academic & Practical Disclaimer</h2>
        <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
          CivicFix was engineered as a comprehensive full-stack MERN demonstration project by Ramya Sri. While fully architected to mirror municipal workflows (routing, triage, GIS mapping, audit logs, and photo verification), integration with actual state or municipal databases in production requires official government permissions and APIs.
        </p>
      </div>
    </div>
  );
};

export default About;
