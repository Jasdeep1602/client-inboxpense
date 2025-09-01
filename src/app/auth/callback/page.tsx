// D:/expense/client/src/app/auth/callback/page.tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      toast.error(error || 'Authentication failed. Please try again.');
      router.push('/');
      return;
    }

    if (token) {
      const login = async () => {
        try {
          // Send the token to our API route to set the cookie
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error('Failed to set authentication session.');
          }

          // On success, the cookie is set. Now redirect.
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
      toast.error('No authentication token found.');
      router.push('/');
    }
  }, [token, error, router]);

  // UI remains the same
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <h1 className='text-xl font-semibold'>Signing you in...</h1>
        <p className='text-muted-foreground text-sm'>
          Please wait while we set up your session.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallback />
    </Suspense>
  );
}
