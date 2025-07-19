'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const SYNC_SOURCES = ['Me', 'Mom', 'Dad'];

export const SyncManager = () => {
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const router = useRouter();

  const handleSync = async (source: string) => {
    setSyncingSource(source);
    setMessage(`Syncing data for ${source}...`);

    try {
      // FIX: Construct the full, absolute URL to the backend API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/sync/drive`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
        // 'credentials: "include"' is crucial to tell the browser to send cookies to a different domain/port
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sync failed');
      }

      setMessage(result.message);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to sync ${source}`;
      setMessage(`Error for ${source}: ${errorMessage}`);
    } finally {
      setTimeout(() => setSyncingSource(null), 3000);
    }
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Data Synchronization</CardTitle>
        <CardDescription>
          Sync transaction data from your Google Drive folders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {SYNC_SOURCES.map((source) => (
            <div
              key={source}
              className='p-4 border rounded-lg flex flex-col items-center justify-center gap-2'>
              <p className='font-medium capitalize'>{source}</p>
              <Button
                onClick={() => handleSync(source)}
                disabled={!!syncingSource}
                variant='outline'
                className='w-full'>
                {syncingSource === source ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          ))}
        </div>
        {message && (
          <div className='mt-4 text-sm p-3 rounded-lg bg-muted text-muted-foreground'>
            <strong>Last Status:</strong> {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
