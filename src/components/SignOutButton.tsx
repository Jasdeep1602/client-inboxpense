import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';

// This is a Server Action that will be called by the form.
async function signOutAction() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  redirect('/');
}

export const SignOutButton = () => {
  return (
    <form action={signOutAction}>
      <Button variant='outline' size='sm'>
        Sign Out
      </Button>
    </form>
  );
};
