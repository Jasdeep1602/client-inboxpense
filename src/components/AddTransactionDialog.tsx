'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import apiClient from '@/lib/apiClient';

type Category = { _id: string; name: string };
type SourceMapping = { _id: string; mappingName: string };

type FormData = {
  amount: number;
  type: 'debit' | 'credit';
  date: Date;
  description?: string;
  mode: string; // The "Account"
  source: string; // The "Profile"
  categoryId?: string;
};

export function AddTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<SourceMapping[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: { date: new Date(), type: 'debit', source: 'Me' },
  });

  // Fetch categories and accounts (source mappings) for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- THIS IS THE FIX ---
        // Use Promise.all with the apiClient for concurrent fetching
        const [catRes, accRes] = await Promise.all([
          apiClient.get('/api/categories'),
          apiClient.get('/api/mappings'),
        ]);

        // Axios provides data directly on the .data property
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setAccounts(Array.isArray(accRes.data) ? accRes.data : []);
        // --- END FIX ---
      } catch (error) {
        console.error('Failed to fetch data for form', error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const onSubmit = async (values: FormData) => {
    try {
      // --- THIS IS THE FIX ---
      // Use the apiClient to post the new transaction data
      await apiClient.post('/api/transactions', values);
      // --- END FIX ---
      toast.success('Manual transaction added.');
      setIsOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error('Failed to add transaction', error);
      toast.error('Could not add transaction.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Manual Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                {...register('amount', { required: true, valueAsNumber: true })}
              />
            </div>
            <Controller
              control={control}
              name='type'
              render={({ field }) => (
                <div>
                  <Label>Type</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='debit'>Debit</SelectItem>
                      <SelectItem value='credit'>Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <Controller
            control={control}
            name='date'
            render={({ field }) => (
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />

          <Controller
            control={control}
            name='mode' // Account
            render={({ field }) => (
              <div>
                <Label>Account</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an account' />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc._id} value={acc.mappingName}>
                        {acc.mappingName}
                      </SelectItem>
                    ))}
                    <SelectItem value='Other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name='categoryId'
            render={({ field }) => (
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent className='max-h-45 overflow-y-auto'>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={control}
            name='source' // Profile
            render={({ field }) => (
              <div>
                <Label>Profile</Label>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a profile' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Me'>Me</SelectItem>
                    <SelectItem value='Mom'>Mom</SelectItem>
                    <SelectItem value='Dad'>Dad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <div>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Input id='description' {...register('description')} />
          </div>

          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
