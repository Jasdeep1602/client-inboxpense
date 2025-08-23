'use client';

import Image from 'next/image';
import { SignOutButton } from './SignOutButton';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenuTrigger } from './Sidebar'; // Import the new trigger

// Since the user data is fetched in the layout and passed down,
// we define the user type for our props.
type User = {
  name: string;
  email: string;
  picture: string;
} | null;

interface HeaderProps {
  title: string;
  user: User;
}

export const Header = ({ title, user }: HeaderProps) => {
  return (
    <header className='fixed top-0 left-0 md:left-64 right-0 bg-background/80 backdrop-blur-sm z-10 border-b'>
      <div className='flex items-center justify-between h-16 px-4 sm:px-6'>
        <div className='flex items-center gap-2'>
          <MobileMenuTrigger />
          <h1 className='text-xl font-semibold'>{title}</h1>
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
