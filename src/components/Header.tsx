import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import * as jose from 'jose';
import { Button } from './ui/button';

async function SignOutButton() {
  'use server';
  const handleSignOut = async () => {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('jwt');
    redirect('/');
  };
  return (
    <form action={handleSignOut}>
      <Button variant='outline' size='sm'>
        Sign Out
      </Button>
    </form>
  );
}
/**
 * A helper function to get user data from the JWT.
 * It's safe to just decode because the route protection in page.tsx or middleware
 * will have already verified the token's validity.
 */
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

/**
 * The main Header component.
 */
export const Header = async () => {
  const user = await getAuthenticatedUser();

  return (
    <header className='fixed top-0 left-0 md:left-64 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-800'>
      <div className='flex items-center justify-between h-16 px-6'>
        <h1 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
          Transactions
        </h1>
        {user ? (
          <div className='flex items-center gap-4'>
            <span className='text-right hidden sm:block'>
              <p className='font-semibold text-sm text-slate-700 dark:text-slate-300'>
                {user.name}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                {user.email}
              </p>
            </span>
            {user.picture && (
              <img
                src={user.picture}
                alt='User'
                className='w-10 h-10 rounded-full'
              />
            )}
            {/* The SignOutButton is now included here */}
            <SignOutButton />
          </div>
        ) : null}
      </div>
    </header>
  );
};
