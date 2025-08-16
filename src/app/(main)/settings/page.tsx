import { SyncManager } from '@/components/SyncManager';
import { SourceMappingManager } from '@/components/SourceMappingManager';

import { CategoryManager } from '@/components/CategoryManager';

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <SyncManager />
      <SourceMappingManager />
      <CategoryManager />
    </div>
  );
}
