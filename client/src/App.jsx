import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import TrackIssue from './pages/TrackIssue';
import PublicIssues from './pages/PublicIssues';
import CitizenDashboard from './pages/CitizenDashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import About from './pages/About';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import AdminDashboard from './admin/AdminDashboard';
import StaffDashboard from './staff/StaffDashboard';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="track" element={<TrackIssue />} />
        <Route path="issues" element={<PublicIssues />} />
        <Route path="issues/map" element={<PublicIssues />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Citizen Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin', 'staff']}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin', 'staff']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'admin', 'staff']}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Staff Protected Routes */}
        <Route
          path="staff"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
