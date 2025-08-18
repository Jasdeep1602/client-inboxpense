'use client'; // This component needs client-side interactivity

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Transactions', href: '/dashboard' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <aside className='fixed top-0 left-0 w-64 h-full bg-slate-900 text-slate-50 p-4 hidden md:flex flex-col'>
      <div className='text-2xl font-bold mb-10 pl-2 tracking-wider'>
        FinTrack
      </div>
      <nav className='flex flex-col gap-2'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-3 rounded-lg text-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 font-semibold text-white shadow-lg'
                  : 'hover:bg-slate-700 text-slate-300'
              }`}>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
