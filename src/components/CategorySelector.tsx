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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn utility

// Type for a single category
type Category = {
  _id: string;
  name: string;
  color: string;
};

// Type for a single transaction (just what we need)
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

  // Fetch all available categories once when the component is first used
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          { credentials: 'include' }
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectCategory = async (categoryId: string) => {
    const newCategoryId = categoryId === selectedCategoryId ? null : categoryId; // Allow unselecting

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${transaction._id}/category`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId: newCategoryId }),
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to update category');

      toast('Success', { description: 'Transaction category updated.' });
      setSelectedCategoryId(newCategoryId || '');
      setOpen(false);
      router.refresh(); // Refresh server components
    } catch (error) {
      toast('Error', { description: 'Could not update category.' });
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {selectedCategory ? (
          <Badge
            variant='outline'
            style={{
              borderColor: selectedCategory.color,
              color: selectedCategory.color,
            }}
            className='cursor-pointer'>
            {selectedCategory.name}
          </Badge>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-xs text-muted-foreground'>
            Uncategorized
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search category...' />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
