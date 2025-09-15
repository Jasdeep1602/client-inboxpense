'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { ChevronsUpDown, X } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { Icon, IconName } from './Icons';

// --- Type Definitions (Unchanged) ---
type Subcategory = {
  _id: string;
  name: string;
  color: string;
  icon: string;
};

type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
};

type Transaction = {
  _id: string;
  subcategoryId?: Subcategory;
};

export function CategorySelector({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const selectedSubcategory = transaction.subcategoryId;

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

  const handleSelect = async (subcategoryId: string | null) => {
    if (subcategoryId === selectedSubcategory?._id) return;

    try {
      await apiClient.patch(`/api/transactions/${transaction._id}/category`, {
        subcategoryId: subcategoryId,
      });
      toast.success('Transaction category updated.');
      router.refresh();
    } catch (error) {
      toast.error('Could not update category.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className='w-auto justify-between font-normal text-xs h-8'>
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
            'Uncategorized'
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel className='text-gray-500'>
          Assign Category
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* --- THIS IS THE FIX: Added max-height and overflow --- */}
        <DropdownMenuGroup className='max-h-[250px] overflow-y-auto'>
          {categories.map(
            (category) =>
              // --- THIS IS THE FIX: Conditional rendering logic ---
              category.subcategories.length > 0 ? (
                // If there ARE subcategories, render the nested menu
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
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenuItem
                          key={subcategory._id}
                          onSelect={() => handleSelect(subcategory._id)}>
                          <Icon
                            name={subcategory.icon as IconName}
                            categoryName={subcategory.name}
                            className='w-4 h-4 mr-2'
                            style={{ color: subcategory.color }}
                          />
                          <span>{subcategory.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                // If there are NO subcategories, render a disabled item
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
            // --- END FIX ---
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleSelect(null)}>
          <X className='mr-2 h-4 w-4' />
          <span>Uncategorized</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
