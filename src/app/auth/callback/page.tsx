'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    // Handle potential errors from the backend redirect
    if (error) {
      toast.error(error || 'Authentication failed. Please try again.');
      router.push('/');
      return;
    }

    if (token) {
      const login = async () => {
        try {
          // Send the token to our own backend (the Next.js API route)
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error('Failed to set authentication session.');
          }

          // On success, redirect to the dashboard
          toast.success('Successfully logged in!');
          router.push('/dashboard');
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : 'An unknown error occurred.'
          );
          router.push('/');
        }
      };
      login();
    } else {
      // If no token is present, redirect home
      toast.error('No authentication token found.');
      router.push('/');
    }
  }, [token, error, router]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <p className='text-muted-foreground'>Please wait, authenticating...</p>
    </div>
  );
}

// Wrap the component in Suspense because useSearchParams requires it
export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallback />
    </Suspense>
  );
}
