'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

type Transaction = {
  _id: string;
  body: string;
  description?: string;
};

interface EditTransactionSheetProps {
  transaction: Transaction;
}

export function EditTransactionSheet({
  transaction,
}: EditTransactionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      description: transaction.description || '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: { description: string }) => {
    try {
      // --- THIS IS THE FIX ---
      // Construct the full, absolute URL to the backend API endpoint.
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transaction._id}`;

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: values.description }),
        // Remember to include credentials to send the HttpOnly cookie
        credentials: 'include',
      });
      // --- END FIX ---

      if (!response.ok) {
        // Try to get a more specific error message from the backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save description');
      }

      toast.success('Your transaction has been updated.');

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Edit transaction error:', error);
      toast.error('Could not save your changes. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Pencil className='h-4 w-4' />
          <span className='sr-only'>Edit Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Add a description to this transaction for your records.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4 space-y-2'>
          <p className='text-sm text-muted-foreground p-3 bg-muted rounded-md'>
            {transaction.body}
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Input
                id='description'
                {...form.register('description')}
                className='col-span-3'
                placeholder='e.g., Dinner with friends'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
