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

export const AnalyticsPeriodFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePeriod = searchParams.get('period') || '6m';

  const handleFilterChange = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', period);
    router.push(`${pathname}?${params.toString()}`);
  };

  const periods = [
    { label: '30 Days', value: '30d' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className='flex space-x-2'>
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={activePeriod === period.value ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleFilterChange(period.value)}>
          {period.label}
        </Button>
      ))}
    </div>
  );
};
