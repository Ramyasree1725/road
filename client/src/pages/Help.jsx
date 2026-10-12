import React from 'react';
import { HelpCircle, PhoneCall, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';

export const Help = () => {
  const faqs = [
    {
      q: 'How do I know my complaint reached the right department?',
      a: 'CivicFix uses automated category and ward-boundary routing. Once you submit, your complaint receives a unique Ticket ID and is queued at the relevant municipal desk (e.g. Roads, Sanitation, Water Works).',
    },
    {
      q: 'What should I do if my complaint is marked "Resolved" but the issue remains?',
      a: 'You can navigate to "Track Complaint", enter your Ticket ID, and click the "Reopen Complaint" button. Specify why the work was unsatisfactory, and municipal supervisors will re-dispatch a crew.',
    },
    {
      q: 'Is my personal contact information visible on the public map?',
      a: 'No. Following strict privacy standards (OWASP data protection guidelines), your email and phone number are stripped from public feeds and are only visible to authorized administrative staff.',
    },
    {
      q: 'Can I report an issue without creating an account?',
      a: 'You can view all public issues and track any ticket without logging in. To submit official complaints and maintain your personal grievance history, a quick 30-second citizen registration is required.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
          Citizen Assistance & FAQs
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Common queries about reporting guidelines, ticket tracking, and emergency civic helplines.
        </p>
      </div>

      {/* Emergency Helplines Notice */}
      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Emergency Services Notice</span>
          </div>
          <p className="text-xs text-amber-700 max-w-lg leading-relaxed">
            For gas leaks, building collapses, electric wire fires, or flood emergencies, do not wait for online ticket triage. Contact civic emergency helplines immediately.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono text-xs font-bold text-amber-900 bg-white/80 p-3 rounded-2xl border border-amber-200">
          <div>Police: 112</div>
          <div>•</div>
          <div>Ambulance: 108</div>
          <div>•</div>
          <div>Disaster: 1077</div>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
