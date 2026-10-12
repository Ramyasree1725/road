import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Map,
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSelect = (role) => {
    switchDemoRole(role);
    setRoleDropdownOpen(false);
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/dashboard');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                Civic<span className="text-brand-600">Fix</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Smart City Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-brand-700 bg-brand-50 font-semibold' : 'hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              {t('navHome')}
            </Link>

            <Link
              to="/issues"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/issues') ? 'text-brand-700 bg-brand-50 font-semibold' : 'hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4 text-brand-600" />
              {t('navIssuesMap')}
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/track') ? 'text-brand-700 bg-brand-50 font-semibold' : 'hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-brand-600" />
              {t('navTrack')}
            </Link>

            {/* Role specific dashboard link */}
            {isAuthenticated && (
              <Link
                to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname.startsWith('/admin') ||
                  location.pathname.startsWith('/staff') ||
                  location.pathname === '/dashboard'
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'hover:text-brand-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-600" />
                {user?.role === 'admin' ? t('navAdmin') : user?.role === 'staff' ? t('navStaff') : t('navDashboard')}
              </Link>
            )}
          </nav>

          {/* Right Controls: Demo Role Pill, Report CTA & Auth */}
          <div className="hidden lg:flex items-center gap-2.5">

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                title="Switch demo persona"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Demo: {user ? user.role.toUpperCase() : 'CITIZEN'}
                </span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleRoleSelect('citizen')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
                  >
                    <span>👤 Citizen View</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">User</span>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('staff')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
                  >
                    <span>🛠️ Municipal Staff</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Field</span>
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium flex items-center justify-between"
                  >
                    <span>🏛️ Municipal Admin</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </Link>

            {/* Primary Action Button: Report Issue */}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 shadow-sm shadow-brand-600/30 hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('btnReportNow')}</span>
            </Link>

            {/* Auth Login/User Dropdown */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-100 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            {t('btnReportNow')}
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
            >
              {t('navHome')}
            </Link>
            <Link
              to="/issues"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
            >
              {t('navIssuesMap')}
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
            >
              {t('navTrack')}
            </Link>
            <Link
              to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-brand-700 rounded-lg bg-brand-50"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Persona Switcher */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 mb-1">Quick Switch Persona:</div>
            <div className="flex gap-1.5">
              <button
                onClick={() => { switchDemoRole('citizen'); setMobileMenuOpen(false); }}
                className="flex-1 py-1 text-xs bg-slate-100 rounded font-semibold text-slate-700"
              >
                Citizen
              </button>
              <button
                onClick={() => { switchDemoRole('staff'); setMobileMenuOpen(false); }}
                className="flex-1 py-1 text-xs bg-amber-50 rounded font-semibold text-amber-800"
              >
                Staff
              </button>
              <button
                onClick={() => { switchDemoRole('admin'); setMobileMenuOpen(false); }}
                className="flex-1 py-1 text-xs bg-purple-50 rounded font-semibold text-purple-800"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
            {isAuthenticated ? (
              <>
                <span className="font-semibold text-slate-700">Signed in as {user?.name}</span>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-rose-600 font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 border rounded-lg font-semibold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-brand-600 text-white rounded-lg font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
