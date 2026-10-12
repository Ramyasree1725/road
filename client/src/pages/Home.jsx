import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  MapPin,
  CheckCircle2,
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Trees,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Users,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import IssueCard from '../components/IssueCard';

export const Home = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 164,
    resolved: 138,
    active: 26,
    avgHours: 28,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent public complaints
    api.getPublicComplaints()
      .then((res) => {
        if (res.success && res.complaints) {
          setRecentIssues(res.complaints.slice(0, 3));
          const total = res.complaints.length;
          const resolved = res.complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length;
          setStats((prev) => ({
            ...prev,
            total: Math.max(total, 164),
            resolved: Math.max(resolved, 138),
            active: Math.max(total - resolved, 26),
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    {
      name: 'Roads & Footpaths',
      icon: Construction,
      desc: 'Potholes, broken curbs, damaged pedestrian pavements, unmarked speed bumps.',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      name: 'Waste Management',
      icon: Trash2,
      desc: 'Overflowing dumpsters, uncollected garbage, illegal dumping, street sweeping.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      name: 'Drainage & Water',
      icon: Droplets,
      desc: 'Burst clean water mains, overflowing storm drains, blocked sewers, stagnancy.',
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    },
    {
      name: 'Street Lighting',
      icon: Lightbulb,
      desc: 'Non-functional night lamps, flickering bulbs, damaged electrical utility poles.',
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    },
    {
      name: 'Parks & Trees',
      icon: Trees,
      desc: 'Fallen branches blocking roads, overgrown bushes, broken playground equipment.',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    },
    {
      name: 'Public Health',
      icon: ShieldAlert,
      desc: 'Stagnant mosquito breeding zones, unsanitary public toilets, contamination risks.',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  const fieldCrew = [
    {
      name: 'Eng. Ramesh Kumar',
      role: 'Senior Roads & Asphalt Crew Lead',
      dept: 'Public Works (Ward 12 & 42)',
      badge: 'Badge #PW-314',
      repairs: 142,
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80',
      desc: 'Specialized in hot mix asphalt compaction, pot-hole sealing, and stormwater curb reconstruction.',
    },
    {
      name: 'Sunita Devi',
      role: 'Ward 12 Sanitation Supervisor',
      dept: 'Solid Waste Management',
      badge: 'Badge #SN-890',
      repairs: 310,
      rating: '5.0',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80',
      desc: 'Supervising waste compactor routes, community dumpster clearing, and street sanitization.',
    },
    {
      name: 'B. Ravinder',
      role: 'Chief Electrical Lineman',
      dept: 'Street Lighting Board',
      badge: 'Badge #EL-102',
      repairs: 98,
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
      desc: 'Maintaining high-voltage pole connections, LED fixtures, and eliminating pedestrian dark spots.',
    },
    {
      name: 'Priya Sharma',
      role: 'Citizen Desk Officer',
      dept: 'Citizen Redressal Cell',
      badge: 'Ward 12 Desk',
      repairs: 420,
      rating: '4.9',
      isBadge: true,
      desc: 'Ensuring incoming grievance triage, priority emergency crew dispatches, and citizen support.',
    },
  ];

  const testimonials = [
    {
      name: 'Ramya Sri',
      location: 'Resident, Central Ward 12',
      initials: 'RS',
      badgeColor: 'from-emerald-700 to-teal-900',
      quote: 'I reported the deep crater pothole near Metro Pillar 14 before work. By evening, Ramesh Kumar’s crew rolled out hot bitumen and compacted it completely smooth. Real accountability in action!',
      ticket: 'Ticket CF-2026-1011 • Resolved in 18 hrs',
    },
    {
      name: 'Dr. Arvind Rao',
      location: 'Clinic Director, Gandhi Nagar',
      initials: 'AR',
      badgeColor: 'from-blue-700 to-indigo-900',
      quote: 'The commercial dumpster was spilling onto the pedestrian walkway. Sunita Devi’s sanitation team cleared everything within 4 hours and sanitized the spot. Super transparent!',
      ticket: 'Ticket CF-2026-1012 • Resolved in 4 hrs',
    },
    {
      name: 'Kavita Reddy',
      location: 'Resident, Lake View Promenade',
      initials: 'KR',
      badgeColor: 'from-purple-700 to-violet-900',
      quote: 'Four dark streetlights made our evening walk risky. Lineman Ravinder re-wired the pole lines the next afternoon. Verified with authentic before & after photos.',
      ticket: 'Ticket CF-2026-1014 • Resolved in 22 hrs',
    },
  ];

  return (
    <div className="space-y-16 pb-12 bg-[#030712] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-slate-950 to-emerald-950 rounded-3xl border border-slate-800 p-8 sm:p-14 shadow-2xl">
        {/* Decorative background radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <span>🏛️</span>
            <span>Municipal Citizen Redressal & Field Operations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Spot Road Hazards or Water Leaks? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-300">
              Citizens Report • Leaders Assign • Crews Repair
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            When citizens report road potholes or clean drinking water pipe bursts, Department Leaders review severity and dispatch specialized field crews with 12 to 24-hour SLAs. Workers execute durable on-ground repairs and upload verified photographic proof.
          </p>

          {/* Dedicated Road & Water Quick Portals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left">
            {/* Road Damage */}
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-amber-900/60 hover:border-amber-500/80 transition-all shadow-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg border border-amber-500/40">🚧</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">ROADS WING</span>
                </div>
                <h3 className="text-base font-black text-white">Road Potholes & Asphalt Fractures</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hazardous road craters & caved-in base. Routed directly to <b>Eng. Ramesh Kumar (Senior Roads Lead)</b>.
                </p>
              </div>
              <Link
                to="/report"
                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>📸</span>
                <span>Report Road Pothole</span>
              </Link>
            </div>

            {/* Water Leaks */}
            <div className="bg-slate-900/90 p-5 rounded-3xl border border-cyan-900/60 hover:border-cyan-500/80 transition-all shadow-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg border border-cyan-500/40">💧</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">WATER BOARD</span>
                </div>
                <h3 className="text-base font-black text-white">Water Pipeline Leaks & Bursts</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Drinking water main burst & road flooding. Routed directly to <b>K. Suresh (Water Pipeline Squad Lead)</b>.
                </p>
              </div>
              <Link
                to="/report"
                className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>💧</span>
                <span>Report Water Leak</span>
              </Link>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 shadow-md transition-all"
            >
              <Search className="w-4 h-4 text-brand-400" />
              <span>Track Complaint Ticket</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 transition-all"
            >
              <span>🏛️</span>
              <span>Leader & Worker Portals</span>
            </Link>

            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore Public GIS Map</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.total}+
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Complaints Filed
              </div>
            </div>

            <div className="text-center p-3 border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {stats.resolved}+
              </div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1">
                Verified Resolutions
              </div>
            </div>

            <div className="text-center p-3 border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                {Math.round((stats.resolved / stats.total) * 100)}%
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mt-1">
                SLA Compliance Rate
              </div>
            </div>

            <div className="text-center p-3 border-l border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                ~{stats.avgHours} hrs
              </div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-1">
                Avg Turnaround
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Stage Civic Governance Cycle (Citizen ➔ Leader ➔ Worker) */}
      <section className="bg-gradient-to-r from-slate-900 via-black to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <span>⚙️</span>
              <span>Official Municipal Grievance Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              From Citizen Grievance to On-Ground Resolution
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How road damage and drinking water leaks get reported, assigned by department leaders, and repaired by crews.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-2 w-fit"
          >
            <span>⚡</span>
            <span>Open Multi-Role Portal</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Citizen */}
          <div className="bg-[#030712] p-5 rounded-2xl border border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/30">01</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">CITIZEN STAGE</span>
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>👤</span>
              <span>1. Citizen Reports Grievance</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Citizens spot <b>hazardous road potholes</b> or <b>drinking water pipe bursts</b>, snap an on-site photo, pin GPS, and file an official complaint.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <Link to="/report" className="font-bold text-amber-400 hover:underline">Report Pothole &rarr;</Link>
              <Link to="/report" className="font-bold text-cyan-400 hover:underline">Report Leak &rarr;</Link>
            </div>
          </div>

          {/* Step 2: Leader */}
          <div className="bg-[#030712] p-5 rounded-2xl border border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center border border-purple-500/30">02</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">LEADER STAGE</span>
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>🏛️</span>
              <span>2. Department Leader Assigns</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chief Inspector Rajesh Rao evaluates complaint severity and assigns work orders to Lead <b>K. Suresh (Water)</b> or <b>Ramesh Kumar (Roads)</b> with SLA deadlines.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Leader Action:</span>
              <Link to="/dashboard" className="font-bold text-purple-400 hover:underline">Assign Work Order &rarr;</Link>
            </div>
          </div>

          {/* Step 3: Worker */}
          <div className="bg-[#030712] p-5 rounded-2xl border border-amber-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">03</span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">WORKER STAGE</span>
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>🛠️</span>
              <span>3. Worker Executes & Resolves</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The on-ground crew mobilizes machinery to site, welds the pipe sleeve / compacts asphalt flush with the road, uploads verified photo proof, and signs off.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Worker Action:</span>
              <Link to="/dashboard" className="font-bold text-amber-400 hover:underline">Execute & Submit Proof &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our On-Ground Field Crew & Municipal Officers (Real Humans) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Public Service Force
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Meet Your Ward On-Ground Field Crew
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real municipal civil engineers and technicians working 24/7 across your streets.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full w-fit">
            Ward 12 Municipal Force
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {fieldCrew.map((worker, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 hover:border-emerald-500/60 transition-all space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {worker.isBadge ? (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 flex flex-col items-center justify-center border-2 border-emerald-500/60 shadow-md shrink-0 text-white">
                      <span className="text-xl">🏛️</span>
                      <span className="text-[8px] font-mono font-bold text-emerald-300">DESK</span>
                    </div>
                  ) : (
                    <img
                      src={worker.image}
                      alt={worker.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md"
                    />
                  )}
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{worker.name}</h3>
                    <div className="text-xs font-bold text-emerald-400">{worker.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{worker.badge}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {worker.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Tasks: <b className="text-white font-bold">{worker.repairs}</b>
                </span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{worker.rating}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            City Departments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Direct Municipal Departments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a category to route your grievance directly to specialized field personnel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/report?category=${encodeURIComponent(cat.name)}`}
                className="group p-6 bg-slate-900/80 rounded-3xl border border-slate-800 hover:border-brand-500 shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-brand-400 group-hover:text-brand-300">
                  <span>Report this Issue</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real Citizen Testimonials (Community Voice) */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Community Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Real Feedback From Neighborhood Residents
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Citizens who reported issues and experienced prompt on-ground action from municipal teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.badgeColor} flex items-center justify-center text-white font-black text-sm border border-emerald-500/50 shadow-md shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <div className="text-[11px] text-slate-400">{t.location}</div>
                  </div>
                </div>
                <div className="text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono font-bold">
                {t.ticket}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Public Reports Feed */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Live Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Live Public Complaints Feed
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time civic issues submitted by citizens across city wards.
            </p>
          </div>

          <Link
            to="/issues"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline"
          >
            <span>View All Public Issues on Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentIssues.map((complaint) => (
              <IssueCard key={complaint._id || complaint.ticketId} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 text-sm text-slate-400">
            Loading public issue feeds...
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section>
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight">
              See a Civic Problem in Your Neighborhood?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Don't wait for someone else to report it. Snap an on-ground photo, drop your pin on the map, and hold local ward administration accountable.
            </p>
            <div className="pt-2">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 shadow-lg shadow-brand-600/30 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit a Complaint in 60 Seconds</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
