'use client';

import { Button } from './ui/button';
import { signOutAction } from '@/lib/actions'; // Import the action from its new file

export const SignOutButton = () => {
  return (
    <form action={signOutAction}>
      <Button variant='outline' size='sm'>
        Sign Out
      </Button>
    </form>
  );
};
