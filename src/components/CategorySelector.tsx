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
  CommandSeparator,
} from '@/components/ui/command';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/lib/apiClient';
import { Icon } from './Icons';

// --- NEW, HIERARCHICAL TYPE DEFINITIONS ---
type Subcategory = {
  _id: string;
  name: string;
  color: string;
  icon: string;
};

type Category = {
  _id: string;
  name: string;
  subcategories: Subcategory[];
};

type Transaction = {
  _id: string;
  subcategoryId?: {
    // Updated from categoryId
    _id: string;
    name: string;
    color: string;
    icon: string;
  };
};

export function CategorySelector({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    transaction.subcategoryId?._id || ''
  );
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories');
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = async (subcategoryId: string) => {
    const newSubcategoryId =
      subcategoryId === selectedSubcategoryId ? null : subcategoryId;

    try {
      // --- THIS IS THE FIX: The endpoint now expects `subcategoryId` ---
      await apiClient.patch(`/api/transactions/${transaction._id}/category`, {
        subcategoryId: newSubcategoryId,
      });
      // --- END FIX ---
      toast.success('Transaction category updated.');
      setSelectedSubcategoryId(newSubcategoryId || '');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Could not update category.');
    }
  };

  const selectedSubcategory = categories
    .flatMap((cat) => cat.subcategories)
    .find((sub) => sub._id === selectedSubcategoryId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-auto justify-between font-normal text-xs h-8'>
          {selectedSubcategory ? (
            <>
              <Icon
                name={selectedSubcategory.icon}
                categoryName={selectedSubcategory.name}
                className='w-4 h-4 mr-2'
                style={{ color: selectedSubcategory.color }}
              />
              {selectedSubcategory.name}
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
            {/* --- THIS IS THE FIX: Render grouped categories --- */}
            {categories.map((category) => (
              <CommandGroup key={category._id} heading={category.name}>
                {category.subcategories.map((subcategory) => (
                  <CommandItem
                    key={subcategory._id}
                    value={subcategory.name}
                    onSelect={() => handleSelect(subcategory._id)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedSubcategoryId === subcategory._id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <Icon
                      name={subcategory.icon}
                      categoryName={subcategory.name}
                      className='w-4 h-4 mr-2'
                      style={{ color: subcategory.color }}
                    />
                    <span>{subcategory.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {/* Add an option to un-assign the category */}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => handleSelect('')}>
                <X className='mr-2 h-4 w-4' />
                Uncategorized
              </CommandItem>
            </CommandGroup>
            {/* --- END FIX --- */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
