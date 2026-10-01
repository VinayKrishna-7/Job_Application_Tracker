import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950 transition-colors">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex flex-1">
        <Sidebar className="hidden lg:flex shrink-0 min-h-[calc(100vh-4rem)] sticky top-16" />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
