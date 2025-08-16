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
import { Transaction } from './TransactionsManager'; // Import main Transaction type
import { toast } from 'sonner';
import { CategorySelector } from './CategorySelector'; // Import the category selector

// A simpler date format for the details view
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

export const TransactionDetailSheet = ({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionDetailSheetProps) => {
  const router = useRouter();

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

  // This function now ONLY saves the description
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

      toast('Success!', { description: 'Your notes have been updated.' });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast('Error', {
        description: 'Could not save your notes.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='w-[400px] sm:w-[540px] flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Review and manage the details of this transaction.
          </SheetDescription>
        </SheetHeader>

        {/* Main Content Area */}
        <div className='flex-grow overflow-y-auto pr-6 space-y-6'>
          {/* Amount and Type */}
          <div className='text-center mt-4'>
            <p
              className={`text-4xl font-bold ${
                transaction.type === 'debit'
                  ? 'text-destructive'
                  : 'text-green-600'
              }`}>
              ₹{transaction.amount.toFixed(2)}
            </p>
            <p className='text-muted-foreground capitalize'>
              {transaction.type}
            </p>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-3 gap-y-4 items-center rounded-lg border p-4'>
            <div className='col-span-1 text-sm text-muted-foreground'>Date</div>
            <div className='col-span-2 font-medium'>
              {formatDate(transaction.date)}
            </div>

            <div className='col-span-1 text-sm text-muted-foreground'>
              Account
            </div>
            <div className='col-span-2 font-medium'>{transaction.mode}</div>

            <div className='col-span-1 text-sm text-muted-foreground'>
              Profile
            </div>
            <div className='col-span-2 font-medium'>{transaction.source}</div>

            <div className='col-span-1 text-sm text-muted-foreground'>
              Category
            </div>
            <div className='col-span-2'>
              {/* The CategorySelector is now inside the sheet */}
              <CategorySelector transaction={transaction} />
            </div>
          </div>

          {/* Raw SMS Body */}
          <div>
            <h4 className='text-sm font-semibold mb-2'>Original Message</h4>
            <p className='text-xs text-muted-foreground bg-muted p-3 rounded-md break-words'>
              {transaction.body}
            </p>
          </div>
        </div>

        {/* Footer with Edit Form for "Your Notes" */}
        <SheetFooter className='mt-auto bg-background pt-4 border-t'>
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
