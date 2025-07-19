import { SyncManager } from '../../../components/SyncManager';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

/**
 * The main page for the /settings route.
 * Its content will also be rendered as the {children} of the (main)/layout.tsx file.
 */
export default function SettingsPage() {
  // Step 1: Protect this route just like the dashboard.
  //   const jwt = cookies().get('jwt')?.value;
  //   if (!jwt) {
  //     redirect('/');
  //   }

  // Step 2: Render the components that make up the settings page.
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and data connections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* We can add user profile editing forms here in the future */}
          <p className='text-muted-foreground'>
            Profile management features coming soon.
          </p>
        </CardContent>
      </Card>

      {/* The SyncManager component is the main feature of the settings page for now. */}
      <SyncManager />
    </div>
  );
}
