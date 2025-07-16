import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';

/**
 * A helper function to verify the JWT from the cookie.
 * It returns the token's payload if valid, otherwise null.
 */
async function verifyAuth(token: string): Promise<jose.JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

/**
 * A Server Action for handling sign-out.
 * It securely deletes the cookie and redirects the user.
 */
async function SignOutButton() {
  'use server';

  const handleSignOut = async () => {
    'use server';
    // FIX: Await the promise to get the cookie store object
    const cookieStore = await cookies();
    // Then call the method on the store
    cookieStore.delete('jwt');
    redirect('/');
  };

  return (
    <form action={handleSignOut}>
      <button
        type='submit'
        className='px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors'>
        Sign Out
      </button>
    </form>
  );
}

export default async function DashboardPage() {
  // FIX: Await the promise to get the cookie store object
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  // If no cookie is found, redirect to the home page immediately.
  if (!jwt) {
    redirect('/');
  }

  // Verify the token is valid and hasn't been tampered with.
  const userPayload = await verifyAuth(jwt);

  // If the token is invalid (e.g., expired or bad secret),
  // delete the bad cookie and redirect to the home page.
  if (!userPayload) {
    // FIX: Reuse the awaited cookie store object
    cookieStore.delete('jwt');
    redirect('/');
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100'>
      <div className='text-center p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
        <p className='text-gray-700 mb-6'>Welcome, you are logged in!</p>
        <div className='text-left space-y-2 text-sm text-gray-600'>
          <p>
            User ID:{' '}
            <code className='bg-gray-200 p-1 rounded break-all'>
              {String(userPayload.sub)}
            </code>
          </p>
          <p>
            Email:{' '}
            <code className='bg-gray-200 p-1 rounded'>
              {String(userPayload.email)}
            </code>
          </p>
        </div>
        <div className='mt-8'>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
