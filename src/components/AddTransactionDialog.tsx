'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Calendar } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { CalendarIcon, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import apiClient from '@/lib/apiClient';
import { Icon, IconName } from './Icons';

// Type Definitions
enum CategoryGroup {
  EXPENSE = 'EXPENSE',
  BUDGET = 'BUDGET',
  INVESTMENT = 'INVESTMENT',
  IGNORED = 'IGNORED',
}

type Subcategory = { _id: string; name: string; icon: string; color: string };
type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  group: CategoryGroup;
  subcategories: Subcategory[];
};
type SourceMapping = { _id: string; mappingName: string; type: string };

type FormData = {
  amount: number;
  type: 'debit' | 'credit';
  date: Date;
  description?: string;
  mode: string;
  source: string;
  subcategoryId?: string;
  accountType?: string;
};

export function AddTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<SourceMapping[]>([]);
  const router = useRouter();

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      type: 'debit',
      source: 'Me',
      mode: '',
      accountType: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedSubcategory(null);
    } else {
      const fetchData = async () => {
        try {
          const [catRes, accRes] = await Promise.all([
            apiClient.get('/api/categories'),
            apiClient.get('/api/mappings'),
          ]);
          setCategories(Array.isArray(catRes.data) ? catRes.data : []);
          setAccounts(Array.isArray(accRes.data) ? accRes.data : []);
        } catch (error) {
          console.error('Failed to fetch data for form', error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const onSubmit = async (values: FormData) => {
    try {
      await apiClient.post('/api/transactions', values);
      toast.success('Manual transaction added.');
      setIsOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error('Failed to add transaction', error);
      toast.error('Could not add transaction.');
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
    setValue('subcategoryId', subcategory?._id, { shouldValidate: true });
  };

  const groupedCategories = useMemo(() => {
    return {
      [CategoryGroup.EXPENSE]: categories.filter(
        (c) => c.group === CategoryGroup.EXPENSE
      ),
      [CategoryGroup.BUDGET]: categories.filter(
        (c) => c.group === CategoryGroup.BUDGET
      ),
      [CategoryGroup.INVESTMENT]: categories.filter(
        (c) => c.group === CategoryGroup.INVESTMENT
      ),
      [CategoryGroup.IGNORED]: categories.filter(
        (c) => c.group === CategoryGroup.IGNORED
      ),
    };
  }, [categories]);

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
            name='mode'
            render={({ field }) => (
              <div>
                <Label>Account</Label>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedAccount = accounts.find(
                      (acc) => acc.mappingName === value
                    );
                    setValue(
                      'accountType',
                      selectedAccount ? selectedAccount.type : ''
                    );
                  }}
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

          <div>
            <Label>Category</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  className='w-full justify-between font-normal'>
                  {selectedSubcategory ? (
                    <>
                      <Icon
                        name={selectedSubcategory.icon as IconName}
                        categoryName={selectedSubcategory.name}
                        className='w-4 h-4 mr-2'
                        style={{ color: selectedSubcategory.color }}
                      />
                      {selectedSubcategory.name}
                    </>
                  ) : (
                    'Select a category'
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[--radix-popover-trigger-width]'>
                <DropdownMenuLabel>Assign Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className='max-h-[200px] overflow-y-auto'>
                  {Object.entries(groupedCategories).map(([group, cats]) =>
                    cats.length > 0 ? (
                      <DropdownMenuSub key={group}>
                        <DropdownMenuSubTrigger>
                          <span className='capitalize'>
                            {group.toLowerCase()}
                          </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {cats.map((category) =>
                              category.subcategories.length > 0 ? (
                                <DropdownMenuSub key={category._id}>
                                  <DropdownMenuSubTrigger>
                                    <Icon
                                      name={category.icon as IconName}
                                      categoryName={category.name}
                                      className='w-4 h-4 mr-2'
                                      style={{ color: category.color }}
                                    />
                                    <span>{category.name}</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                      {category.subcategories.map(
                                        (subcategory) => (
                                          <DropdownMenuItem
                                            key={subcategory._id}
                                            onSelect={() =>
                                              handleSubcategorySelect(
                                                subcategory
                                              )
                                            }>
                                            <Icon
                                              name={
                                                subcategory.icon as IconName
                                              }
                                              categoryName={subcategory.name}
                                              className='w-4 h-4 mr-2'
                                              style={{
                                                color: subcategory.color,
                                              }}
                                            />
                                            <span>{subcategory.name}</span>
                                          </DropdownMenuItem>
                                        )
                                      )}
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                              ) : (
                                <DropdownMenuItem key={category._id} disabled>
                                  <Icon
                                    name={category.icon as IconName}
                                    categoryName={category.name}
                                    className='w-4 h-4 mr-2'
                                    style={{ color: category.color }}
                                  />
                                  <span>{category.name}</span>
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ) : null
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Controller
            control={control}
            name='source'
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
