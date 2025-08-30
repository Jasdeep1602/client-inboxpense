'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/lib/apiClient';

type Category = {
  _id: string;
  name: string;
  color: string;
};

type Transaction = {
  _id: string;
  categoryId?: {
    _id: string;
    name: string;
    color: string;
  };
};

export function CategorySelector({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    transaction.categoryId?._id || ''
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // --- THIS IS THE FIX ---
        const response = await apiClient.get('/api/categories');
        setCategories(Array.isArray(response.data) ? response.data : []);
        // --- END FIX ---
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectCategory = async (categoryId: string) => {
    const newCategoryId = categoryId === selectedCategoryId ? null : categoryId;

    try {
      // --- THIS IS THE FIX ---
      await apiClient.patch(`/api/transactions/${transaction._id}/category`, {
        categoryId: newCategoryId,
      });
      // --- END FIX ---
      toast.success('Transaction category updated.');
      setSelectedCategoryId(newCategoryId || '');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Could not update category.');
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-auto justify-between font-normal text-xs h-8'>
          {selectedCategory ? (
            <>
              <span
                className='w-2 h-2 rounded-full mr-2'
                style={{ backgroundColor: selectedCategory.color }}
              />
              {selectedCategory.name}
            </>
          ) : (
            'Uncategorized'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search category...' />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <div className='max-h-[200px] overflow-y-auto'>
                {categories.map((category) => (
                  <CommandItem
                    key={category._id}
                    value={category.name}
                    onSelect={() => handleSelectCategory(category._id)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCategoryId === category._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
