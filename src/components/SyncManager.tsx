'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { RefreshCw } from 'lucide-react';
import apiClient from '@/lib/apiClient';

const SYNC_SOURCES = ['Me', 'Mom', 'Dad'];

// Correct, Modern Google Drive Icon SVG
const GoogleDriveIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width='100'
    height='100'
    viewBox='0 0 48 48'>
    <path
      fill='#1e88e5'
      d='M38.59,39c-0.535,0.93-0.298,1.68-1.195,2.197C36.498,41.715,35.465,42,34.39,42H13.61 c-1.074,0-2.106-0.285-3.004-0.802C9.708,40.681,9.945,39.93,9.41,39l7.67-9h13.84L38.59,39z'></path>
    <path
      fill='#fbc02d'
      d='M27.463,6.999c1.073-0.002,2.104-0.716,3.001-0.198c0.897,0.519,1.66,1.27,2.197,2.201l10.39,17.996 c0.537,0.93,0.807,1.967,0.808,3.002c0.001,1.037-1.267,2.073-1.806,3.001l-11.127-3.005l-6.924-11.993L27.463,6.999z'></path>
    <path
      fill='#e53935'
      d='M43.86,30c0,1.04-0.27,2.07-0.81,3l-3.67,6.35c-0.53,0.78-1.21,1.4-1.99,1.85L30.92,30H43.86z'></path>
    <path
      fill='#4caf50'
      d='M5.947,33.001c-0.538-0.928-1.806-1.964-1.806-3c0.001-1.036,0.27-2.073,0.808-3.004l10.39-17.996 c0.537-0.93,1.3-1.682,2.196-2.2c0.897-0.519,1.929,0.195,3.002,0.197l3.459,11.009l-6.922,11.989L5.947,33.001z'></path>
    <path
      fill='#1565c0'
      d='M17.08,30l-6.47,11.2c-0.78-0.45-1.46-1.07-1.99-1.85L4.95,33c-0.54-0.93-0.81-1.96-0.81-3H17.08z'></path>
    <path
      fill='#2e7d32'
      d='M30.46,6.8L24,18L17.53,6.8c0.78-0.45,1.66-0.73,2.6-0.79L27.46,6C28.54,6,29.57,6.28,30.46,6.8z'></path>
  </svg>
);

export const SyncManager = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedLastSynced = localStorage.getItem('lastSynced');
    if (storedLastSynced) {
      setLastSynced(new Date(storedLastSynced).toLocaleString());
    }
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setMessage('');
    let errorOccurred = false;

    for (const source of SYNC_SOURCES) {
      setMessage(`Syncing data for ${source}...`);
      try {
        // --- THIS IS THE FIX ---
        // Use the apiClient to send the POST request for syncing
        await apiClient.post('/api/sync/drive', { source });
        // --- END FIX ---
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : `Failed to sync ${source}`;
        setMessage(`Error: ${errorMessage}`);
        errorOccurred = true;
        break;
      }
    }

    if (!errorOccurred) {
      const now = new Date();
      const formattedDate = now.toLocaleString();
      setLastSynced(formattedDate);
      localStorage.setItem('lastSynced', now.toISOString());
      setMessage('All profiles synced successfully.');
      router.refresh();
    }

    setIsSyncing(false);
  };

  return (
    <Card className='mb-6 bg-background/80 dark:bg-background/50 backdrop-blur-sm'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <span className='w-8 h-8 flex items-center justify-center'>
            <GoogleDriveIcon />
          </span>
          <div>
            <CardTitle>Data Synchronization</CardTitle>
            <CardDescription>
              Sync transaction data from your Google Drive folders.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className='w-full sm:w-auto'>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync All Profiles'}
          </Button>
          <div className='text-sm text-muted-foreground text-center sm:text-left flex-1'>
            {isSyncing && <p>{message}</p>}
            {!isSyncing && lastSynced && <p>Last synced: {lastSynced}</p>}
            {!isSyncing && !lastSynced && (
              <p>No sync has been performed yet.</p>
            )}
          </div>
        </div>
        {!isSyncing && message && (
          <div className='mt-4 text-sm p-3 rounded-lg bg-muted text-muted-foreground'>
            <strong>Last Status:</strong> {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
