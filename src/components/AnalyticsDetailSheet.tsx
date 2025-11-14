'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import apiClient from '@/lib/apiClient';
import {
  DetailData,
  SubcategoryBreakdownData,
  CategorySpendingData,
} from '@/app/(main)/analytics/page';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CHART_COLOR_PALETTE } from '@/lib/colors';

interface AnalyticsDetailSheetProps {
  data: DetailData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatMonth = (monthStr: string) => {
  if (!monthStr || !monthStr.includes('-')) return 'Invalid Date';
  const [year, month] = monthStr.split('-');
  return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleString(
    'en-US',
    { month: 'long', year: 'numeric', timeZone: 'UTC' }
  );
};

// --- UPDATED CategoryBreakdown Component with Modern UI ---
const CategoryBreakdown = ({
  category,
  onTotalCalculated,
}: {
  category: CategorySpendingData;
  onTotalCalculated: (total: number) => void;
}) => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'All';
  const month =
    searchParams.get('month') || new Date().toISOString().substring(0, 7);

  const [breakdown, setBreakdown] = useState<SubcategoryBreakdownData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!category.parentId) return;

    const fetchBreakdown = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          '/api/summary/subcategory-breakdown',
          {
            params: { source, month, parentId: category.parentId },
          }
        );
        const data = Array.isArray(response.data) ? response.data : [];

        // --- THIS IS THE FIX ---
        // Programmatically assign colors from the palette to ensure uniqueness
        const coloredData = data.map((item, index) => ({
          ...item,
          color: CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length],
        }));
        // --- END FIX ---

        setBreakdown(coloredData);
        const trueTotal = data.reduce((sum, item) => sum + item.total, 0);
        setTotal(trueTotal);
        onTotalCalculated(trueTotal);
      } catch (error) {
        console.error('Failed to fetch breakdown:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBreakdown();
  }, [category.parentId, source, month, onTotalCalculated]);

  if (isLoading) {
    return (
      <div className='space-y-4 pt-4'>
        <Skeleton className='h-4 w-full' />
        <div className='pt-4 space-y-3'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-6 w-1/2' />
        </div>
      </div>
    );
  }

  if (breakdown.length === 0) {
    return (
      <p className='text-sm text-muted-foreground text-center pt-8'>
        No spending data for this category in the selected period.
      </p>
    );
  }

  return (
    <div className='space-y-6 text-left pt-4'>
      <TooltipProvider>
        <div className='flex w-full h-2 overflow-hidden bg-muted'>
          {breakdown.map((sub) => (
            <Tooltip key={sub.name} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className='h-full transition-all duration-300'
                  style={{
                    width: `${(sub.total / total) * 100}%`,
                    backgroundColor: sub.color,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                {sub.name}: ₹{sub.total.toFixed(2)} (
                {((sub.total / total) * 100).toFixed(1)}%)
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className='space-y-3'>
        {breakdown.map((sub) => (
          <div
            key={sub.name}
            className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-3'>
              <div
                className='h-3 w-3 flex-shrink-0'
                style={{ backgroundColor: sub.color }}
              />
              <span className='font-medium text-foreground'>{sub.name}</span>
            </div>
            <span className='font-mono text-muted-foreground'>
              ₹{sub.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main AnalyticsDetailSheet (unchanged except for types) ---
export const AnalyticsDetailSheet = ({
  data,
  isOpen,
  onOpenChange,
}: AnalyticsDetailSheetProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const sheetSide = isDesktop ? 'right' : 'bottom';
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCalculatedTotal(null);
    }
  }, [isOpen]);

  if (!data) return null;

  const isMonthData = data.type === 'month';
  const title = isMonthData
    ? 'Monthly Summary'
    : `Breakdown for ${data.data.name}`;

  let description = 'Loading details...';
  if (isMonthData) {
    description = `Details for ${formatMonth(data.data.month)}`;
  } else if (calculatedTotal !== null) {
    description = `Total spent: ₹${calculatedTotal.toFixed(2)}`;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={sheetSide}
        className={cn(
          'flex flex-col p-6',
          isDesktop ? 'w-full sm:max-w-md' : 'h-[60vh] rounded-t-2xl'
        )}>
        <SheetHeader className='text-left mb-2'>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className='text-base'>
            {description}
          </SheetDescription>
        </SheetHeader>
        <div className='flex-grow overflow-y-auto pr-2'>
          {isMonthData ? (
            <div className='space-y-6 text-center flex flex-col items-center justify-center h-full'>
              <div>
                <p className='text-sm text-green-600'>Total Credit</p>
                <p className='text-4xl font-bold text-green-600'>
                  ₹{data.data.totalCredit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className='text-sm text-destructive'>Total Debit</p>
                <p className='text-4xl font-bold text-destructive'>
                  ₹{data.data.totalDebit.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <CategoryBreakdown
              category={data.data as CategorySpendingData}
              onTotalCalculated={setCalculatedTotal}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
