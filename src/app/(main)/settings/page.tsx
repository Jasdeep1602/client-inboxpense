import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SyncManager } from '../../../components/SyncManager';
import { SourceMappingManager } from '../../../components/SourceMappingManager';

import { CategoryManager } from '@/components/CategoryManager';

/**
 * The main page for the /settings route.
 */
export default async function SettingsPage() {
  // Protect the settings page from unauthenticated access.
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) {
    redirect('/');
  }

  // Render the components that make up the settings page.
  return (
    <div className='space-y-6'>
      <SyncManager />
      <SourceMappingManager />
      <CategoryManager />
    </div>
  );
}
