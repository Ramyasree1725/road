import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#030712] text-slate-100">
      {/* Sleek Vertical Sidebar on Left (No top menu bar) */}
      <Sidebar />

      {/* Main Content Area on Right */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
