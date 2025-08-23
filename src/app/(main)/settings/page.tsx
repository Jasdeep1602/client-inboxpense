import { SyncManager } from '@/components/SyncManager';
import { SourceMappingManager } from '@/components/SourceMappingManager';

import { CategoryManager } from '@/components/CategoryManager';
import { Header } from '@/components/Header';

export default function SettingsPage() {
  return (
    <>
      <div className='p-6 pt-5 space-y-6'>
        <SyncManager />
        <SourceMappingManager />
        <CategoryManager />
      </div>
    </>
  );
}
