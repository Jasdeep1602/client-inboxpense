// D:/expense/client/src/components/DateRangeFilterDialog.tsx

'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { CalendarIcon, Filter } from 'lucide-react';

export function DateRangeFilterDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  // Initialize date state from URL parameters
  const [fromDate, setFromDate] = useState<Date | undefined>(
    searchParams.get('from')
      ? new Date(searchParams.get('from') as string)
      : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    searchParams.get('to')
      ? new Date(searchParams.get('to') as string)
      : undefined
  );

  const handleApply = () => {
    if (fromDate && toDate) {
      const params = new URLSearchParams(searchParams);
      params.set('from', format(fromDate, 'yyyy-MM-dd'));
      params.set('to', format(toDate, 'yyyy-MM-dd'));
      params.set('groupBy', 'none'); // Force groupBy to none
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
    const params = new URLSearchParams(searchParams);
    params.delete('from');
    params.delete('to');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Filter className='mr-2 h-4 w-4' />
          Date Range
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Filter by Date Range</DialogTitle>
          <DialogDescription>
            Select a start and end date to see transactions within that period.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='from-date'>From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='from-date'
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !fromDate && 'text-muted-foreground'
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {fromDate ? (
                    format(fromDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={fromDate}
                  onSelect={setFromDate}
                  disabled={{ after: new Date() }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='to-date'>To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='to-date'
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !toDate && 'text-muted-foreground'
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {toDate ? format(toDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={toDate}
                  onSelect={setToDate}
                  disabled={{ before: fromDate, after: new Date() }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleApply} disabled={!fromDate || !toDate}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
