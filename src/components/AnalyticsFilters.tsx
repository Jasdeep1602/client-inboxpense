'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

const FILTER_SOURCES = ['All', 'Me', 'Mom', 'Dad'];

export const AnalyticsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('source') || 'All';

  const handleFilterChange = (source: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('source', source);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex space-x-2'>
      {FILTER_SOURCES.map((source) => (
        <Button
          key={source}
          variant={activeFilter === source ? 'default' : 'secondary'}
          onClick={() => handleFilterChange(source)}>
          {source}
        </Button>
      ))}
    </div>
  );
};
