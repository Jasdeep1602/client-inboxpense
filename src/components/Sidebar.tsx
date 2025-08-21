/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './Icons'; // Import our Icon component

export const Sidebar = () => {
  const pathname = usePathname();

  // Add an `icon` property to each navigation item
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutGrid' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart2' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ];

  return (
    // --- GLASSMORPHISM STYLES APPLIED HERE ---
    <aside className='fixed top-0 left-0 w-64 h-full bg-slate-900/90 backdrop-blur-lg text-slate-100 p-4 hidden md:flex flex-col border-r border-slate-300/20'>
      <div className='text-2xl font-bold mb-10 pl-2 tracking-wider'>
        FinTrack
      </div>
      <nav className='flex flex-col gap-2'>
        {navItems.map((item) => {
          // Use `startsWith` for a better active-state check (e.g., /analytics?source=Me)
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              // --- REFINED LINK STYLES ---
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg' // Active
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Inactive
              }`}>
              {/* Render the icon dynamically */}
              <Icon name={item.icon as any} size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
