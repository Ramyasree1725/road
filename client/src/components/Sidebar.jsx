import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  Map,
  Search,
  LayoutDashboard,
  ShieldCheck,
  PhoneCall,
  LogOut,
  Users,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCam, setActiveCam] = React.useState('roads');

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleRoleChange = (role) => {
    switchDemoRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/dashboard');
  };

  const getPersonaData = () => {
    const role = user?.role || 'citizen';
    if (role === 'staff') {
      return {
        name: 'Eng. Ramesh Kumar',
        title: 'Senior Roads Lead • Asphalt Crew #4',
        badge: 'PWD Badge #PW-314 • 142 Repairs',
        avatar: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80',
        icon: '🛠️',
        badgeColor: 'from-amber-600 to-orange-700',
      };
    }
    if (role === 'admin') {
      return {
        name: 'Rajesh Rao',
        title: 'Chief Ward Inspector • Central Ward 12',
        badge: 'Gazette Badge #M-4089 • Command',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        icon: '🏛️',
        badgeColor: 'from-purple-600 to-indigo-800',
      };
    }
    return {
      name: user?.name || 'Ramya Sri',
      title: 'Ward 12 Resident • Verified Citizen',
      badge: 'Pass #CF-CIT-9812 • 180 Pts',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      icon: '✓',
      badgeColor: 'from-emerald-600 to-teal-800',
    };
  };

  const persona = getPersonaData();

  return (
    <aside className="w-full md:w-72 md:fixed md:top-0 md:left-0 md:bottom-0 md:h-screen bg-black text-white flex flex-col shrink-0 overflow-y-auto border-r border-slate-800/80 z-50 shadow-2xl">
      {/* Top Header & Navigation */}
      <div className="p-5 space-y-5">
        
        {/* Brand Header with Real Civic Seal */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center p-2 shadow-lg shadow-brand-500/40 border border-emerald-500/40 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white leading-none">
                Civic<span className="text-brand-400">Fix</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Smart City Platform
              </div>
            </div>
          </Link>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        {/* Real Municipal Persona Identity Badge (100% Real, No AI Model Photos) */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={persona.avatar}
                alt={persona.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500/60 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[7px] font-black text-white">✓</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PERSPECTIVE:
                </span>
                <span className="text-brand-400 font-mono font-bold text-[10px] uppercase">
                  {user?.role || 'CITIZEN'}
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-white truncate flex items-center gap-1">
                <span>{persona.name}</span>
                <span className="text-emerald-400 text-[10px]">✓</span>
              </h4>
              <p className="text-[10px] text-emerald-400 font-medium truncate">{persona.title}</p>
              <span className="inline-block text-[9px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 mt-0.5">
                {persona.badge}
              </span>
            </div>
          </div>

          <select
            value={user?.role || 'citizen'}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-xs font-bold bg-[#030712] text-slate-200 border border-slate-700/80 px-3 py-2 rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="citizen">👤 Ramya Sri (Citizen Mode)</option>
            <option value="staff">🛠️ Eng. Ramesh (Field Staff)</option>
            <option value="admin">🏛️ Rajesh Rao (City Admin)</option>
          </select>
        </div>

        {/* Real-Time On-Duty Officer Live Card */}
        <div className="p-3 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-400 uppercase tracking-wider">MUNICIPAL DESK</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span>LIVE ON DUTY</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
              alt="Officer Priya Sharma"
              className="w-9 h-9 rounded-xl object-cover border border-emerald-500/60 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-white truncate">Smt. Priya Sharma</div>
              <div className="text-[10px] text-slate-400 truncate">Senior Citizen Desk Officer</div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <Link
          to="/report"
          className="w-full py-3.5 px-4 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 hover:from-brand-500 hover:to-teal-600 shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report a Civic Issue</span>
        </Link>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1.5 text-xs font-bold text-slate-400">
          <Link
            to="/"
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
              isActive('/')
                ? 'text-white bg-brand-600 font-extrabold shadow-sm'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>City Overview (Home)</span>
          </Link>

          <Link
            to="/issues"
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
              isActive('/issues')
                ? 'text-white bg-brand-600 font-extrabold shadow-sm'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Map className="w-4 h-4" />
              <span>Live Issues & GIS Map</span>
            </div>
            <span className="bg-slate-800 text-brand-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              4 Active
            </span>
          </Link>

          <Link
            to="/track"
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
              isActive('/track')
                ? 'text-white bg-brand-600 font-extrabold shadow-sm'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Track Grievance Ticket</span>
          </Link>

          <Link
            to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard'}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
              location.pathname.startsWith('/admin') ||
              location.pathname.startsWith('/staff') ||
              location.pathname === '/dashboard'
                ? 'text-white bg-brand-600 font-extrabold shadow-sm'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Portal Dashboard</span>
            </div>
            <span className="bg-purple-900/60 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              Live
            </span>
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Real-Time Field Cam & Helplines */}
      <div className="p-5 border-t border-slate-800/80 space-y-4">
        
        {/* Real-Time Field Cam Feed (100% Real-Time On-Ground Photos) */}
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-rose-400">REAL-TIME FIELD CAM</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px]">
              1080P HD
            </span>
          </div>
          <div className="relative h-20 rounded-xl overflow-hidden border border-slate-800">
            <img
              src={
                activeCam === 'roads'
                  ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80'
                  : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'
              }
              alt="Realtime Cam"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute top-1 left-1.5 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>{activeCam === 'roads' ? 'CAM-04 • ROAD CREW' : 'CAM-09 • SANITATION'}</span>
            </div>
            <div className="absolute bottom-1 left-2 right-2 text-white text-[10px]">
              <div className="font-extrabold truncate text-[10px]">
                {activeCam === 'roads' ? 'MG Ring Road • Ward 42' : 'Gandhi Nagar Market • Ward 12'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
            <button
              type="button"
              onClick={() => setActiveCam('roads')}
              className={`py-1 px-1.5 rounded-lg text-center transition-all ${
                activeCam === 'roads'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              🚧 Road Cam
            </button>
            <button
              type="button"
              onClick={() => setActiveCam('waste')}
              className={`py-1 px-1.5 rounded-lg text-center transition-all ${
                activeCam === 'waste'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              🚛 Waste Cam
            </button>
          </div>
        </div>

        {/* Emergency SOS Box */}
        <div className="p-3 bg-rose-950/30 rounded-2xl border border-rose-900/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>24/7 Emergency Helplines</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white pt-1">
            <span>Police: 112</span>
            <span>•</span>
            <span>Ambulance: 108</span>
            <span>•</span>
            <span>Disaster: 1077</span>
          </div>
        </div>

        {/* User Account / Logout */}
        {isAuthenticated ? (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${persona.badgeColor} text-white flex items-center justify-center font-bold text-xs border border-emerald-500 shrink-0`}>
                {persona.icon}
              </div>
              <span className="text-slate-300 font-bold truncate max-w-[120px]">{persona.name}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-rose-400 font-bold p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 text-xs font-bold pt-1">
            <Link to="/login" className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl">
              Login
            </Link>
            <Link to="/register" className="flex-1 text-center py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl">
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
