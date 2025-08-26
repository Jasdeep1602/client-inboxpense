'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Transaction } from './TransactionsManager';
import { toast } from 'sonner';
import { CategorySelector } from './CategorySelector';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

interface TransactionDetailSheetProps {
  transaction: Transaction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// A reusable component for displaying detail items
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className='flex justify-between items-center py-3 border-b border-border/50'>
    <p className='text-sm text-muted-foreground'>{label}</p>
    <div className='text-right font-medium text-sm'>{value}</div>
  </div>
);

export const TransactionDetailSheet = ({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailSheetProps) => {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const sheetSide = isDesktop ? 'right' : 'bottom';

  const form = useForm({
    defaultValues: {
      description: transaction.description || '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = form;

  const onSaveNotes = async (values: { description: string }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transaction._id}`;
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: values.description }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to save notes');
      toast.success('Your notes have been updated.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Save notes error:', error);
      toast.error('Could not save your notes.');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={sheetSide}
        className={cn(
          'flex flex-col p-0',
          isDesktop ? 'w-full sm:max-w-md' : 'h-[95vh] rounded-t-2xl'
        )}>
        <SheetHeader className='p-6 pb-4 text-left'>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Review and manage the details of this transaction.
          </SheetDescription>
        </SheetHeader>

        <div className='flex-grow overflow-y-auto px-6 space-y-6'>
          <div className='text-center py-4'>
            <p
              className={`text-5xl font-bold ${
                transaction.type === 'debit'
                  ? 'text-destructive'
                  : 'text-green-600'
              }`}>
              ₹{transaction.amount.toFixed(2)}
            </p>
            <p className='text-muted-foreground capitalize text-sm'>
              {transaction.type}
            </p>
          </div>

          <div className='space-y-2'>
            <DetailItem label='Date' value={formatDate(transaction.date)} />
            <DetailItem label='Account' value={transaction.mode} />
            <DetailItem label='Profile' value={transaction.source} />
            <DetailItem
              label='Category'
              value={<CategorySelector transaction={transaction} />}
            />
          </div>

          <div>
            <h4 className='text-sm font-semibold mb-2'>Original Message</h4>
            <p className='text-xs text-muted-foreground bg-muted p-3 rounded-md break-words'>
              {transaction.body}
            </p>
          </div>
        </div>

        <SheetFooter className='mt-auto bg-background/95 backdrop-blur-sm p-6 border-t'>
          <form
            onSubmit={handleSubmit(onSaveNotes)}
            className='w-full space-y-4'>
            <div>
              <Label htmlFor='description' className='font-semibold'>
                Your Notes
              </Label>
              <Input
                id='description'
                {...register('description')}
                placeholder='Add a personal note...'
                className='mt-2'
              />
            </div>
            <Button
              type='submit'
              disabled={isSubmitting || !isDirty}
              className='w-full'>
              {isSubmitting ? 'Saving...' : 'Save Notes'}
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
