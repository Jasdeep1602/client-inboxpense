import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SyncManager } from '../../../components/SyncManager';
import { SourceMappingManager } from '../../../components/SourceMappingManager';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your data connections and automation rules.
          </CardDescription>
        </CardHeader>
      </Card>

      <SyncManager />
      <SourceMappingManager />
    </div>
  );
}
