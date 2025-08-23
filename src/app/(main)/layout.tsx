import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

// Server-side function to get user data from JWT
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) return null;

  try {
    const payload = jose.decodeJwt(jwt);
    return {
      name: String(payload.name || 'User'),
      email: String(payload.email || ''),
      picture: String(payload.picture || ''),
    };
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// A Server Component wrapper to fetch data and pass it to the client Header
async function HeaderController() {
  const user = await getAuthenticatedUser();
  // The Header component will now determine its own title
  return <Header user={user} />;
}

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-muted/40'>
      <Sidebar />
      <div className='relative md:ml-64'>
        <Suspense fallback={<div className='h-16' />}>
          <HeaderController />
        </Suspense>

        {/* The main content area now has a top margin to account for the fixed header */}
        <main className='pt-16'>{children}</main>
      </div>
    </div>
  );
}
