import { cookies } from 'next/headers';
import * as jose from 'jose';
import { SignOutButton } from './SignOutButton'; // Import the clean sign-out button
import { ThemeToggle } from './ThemeToggle'; // Import the new theme toggle
import Image from 'next/image'; // Import Image for user profile picture

/**
 * A helper function to get user data from the JWT.
 * This runs on the server.
 */
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) return null;

  try {
    // Since the middleware has already verified the token, we can just decode it.
    const payload = jose.decodeJwt(jwt);
    return {
      name: String(payload.name || 'User'),
      email: String(payload.email || ''),
      picture: String(payload.picture || ''),
    };
  } catch (error) {
    console.error('Failed to decode JWT in Header:', error);
    return null;
  }
}

/**
 * The main Header component. This is a Server Component.
 */
export const Header = async ({ title }: { title: string }) => {
  const user = await getAuthenticatedUser();

  return (
    <header className='fixed top-0 left-0 md:left-64 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-slate-800'>
      <div className='flex items-center justify-between h-16 px-6'>
        {/* We'll make this title dynamic later */}
        <div className='flex items-center gap-4'>
          {' '}
          <h1 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>
            {title}
          </h1>
          {/* Theme toggle button */}
          <ThemeToggle />
        </div>

        {/* User info and actions */}
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <span className='text-right hidden sm:block'>
                <p className='font-semibold text-sm text-slate-700 dark:text-slate-300'>
                  {user.name}
                </p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  {user.email}
                </p>
              </span>
              {user.picture && (
                <Image
                  src={user.picture}
                  alt='User'
                  width={40}
                  height={40}
                  className='rounded-full'
                />
              )}
              <SignOutButton />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
