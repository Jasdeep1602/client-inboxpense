'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Import the hook
import { SignOutButton } from './SignOutButton';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenuTrigger } from './Sidebar';

type User = {
  name: string;
  email: string;
  picture: string;
} | null;

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname(); // Get the current path

  // --- DYNAMIC TITLE LOGIC ---
  let pageTitle = 'Dashboard'; // Default title
  if (pathname.startsWith('/analytics')) {
    pageTitle = 'Analytics';
  } else if (pathname.startsWith('/settings')) {
    pageTitle = 'Settings';
  }
  // --- END DYNAMIC TITLE LOGIC ---

  return (
    <header className='fixed top-0 left-0 md:left-64 right-0 bg-background/80 backdrop-blur-sm z-10 border-b'>
      <div className='flex items-center justify-between h-16 px-4 sm:px-6'>
        <div className='flex items-center gap-2'>
          <MobileMenuTrigger />
          <h1 className='text-xl font-semibold'>{pageTitle}</h1>{' '}
          {/* Render dynamic title */}
        </div>

        <div className='flex items-center gap-4'>
          <ThemeToggle />
          {user ? (
            <>
              <span className='text-right hidden sm:block'>
                <p className='font-semibold text-sm'>{user.name}</p>
                <p className='text-xs text-muted-foreground'>{user.email}</p>
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
