import React from 'react';
import { Sidebar } from '../../components/Sidebar'; // Import the new client component
// This layout is now a SERVER COMPONENT (no 'use client' at the top)
export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-slate-100 dark:bg-slate-950'>
      {/* The Sidebar is a Client Component, but it can be rendered by a Server Component. */}
      <Sidebar />

      <div className='relative md:ml-64'>
        {/* The Header is a Server Component. */}

        <main className='p-6 pt-24'>{children}</main>
      </div>
    </div>
  );
}
