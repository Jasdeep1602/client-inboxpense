'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  // We still clear the cookie in case it exists from a previous version
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  // The crucial part is redirecting to a page that can clear localStorage
  redirect('/?logout=true');
}
