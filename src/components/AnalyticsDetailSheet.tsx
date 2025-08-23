'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

// This component can display data for either a month or a category
type DetailData =
  | { type: 'month'; month: string; totalCredit: number; totalDebit: number }
  | { type: 'category'; name: string; value: number; color: string };

interface AnalyticsDetailSheetProps {
  data: DetailData | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleString(
    'en-US',
    { month: 'long', year: 'numeric', timeZone: 'UTC' }
  );
};

export const AnalyticsDetailSheet = ({
  data,
  isOpen,
  onOpenChange,
}: AnalyticsDetailSheetProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const sheetSide = isDesktop ? 'right' : 'bottom';

  if (!data) return null;

  const isMonthData = data.type === 'month';
  const title = isMonthData ? 'Monthly Summary' : 'Category Spending';
  const description = isMonthData
    ? `Details for ${formatMonth(data.month)}`
    : `Total spent on ${data.name}`;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={sheetSide}
        className={cn(
          'flex flex-col p-6',
          isDesktop ? 'w-full sm:max-w-sm' : 'h-[40vh] rounded-t-2xl'
        )}>
        <SheetHeader className='text-left'>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className='flex-grow flex flex-col items-center justify-center text-center'>
          {isMonthData ? (
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-green-600'>Credit</p>
                <p className='text-4xl font-bold text-green-600'>
                  ₹{data.totalCredit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className='text-sm text-destructive'>Debit</p>
                <p className='text-4xl font-bold text-destructive'>
                  ₹{data.totalDebit.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className='text-sm text-muted-foreground'>{data.name}</p>
              <p className='text-5xl font-bold' style={{ color: data.color }}>
                ₹{data.value.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
