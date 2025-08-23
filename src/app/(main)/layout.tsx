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

// A new async component to fetch data and render the Header
async function HeaderController({ title }: { title: string }) {
  const user = await getAuthenticatedUser();
  return <Header title={title} user={user} />;
}

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We'll extract the title from the children later for dynamic titles
  // For now, it's a placeholder.
  const pageTitle = 'Dashboard';

  return (
    <div className='min-h-screen bg-muted/40'>
      <Sidebar />
      <div className='relative md:ml-64'>
        {/*
          The Header is now a Client Component, but we wrap its data fetching
          in a Server Component to keep the logic on the server.
        */}
        <Suspense>
          <HeaderController title={pageTitle} />
        </Suspense>

        {/* The main content area now has a top margin to account for the fixed header */}
        <main className='pt-16'>{children}</main>
      </div>
    </div>
  );
}
