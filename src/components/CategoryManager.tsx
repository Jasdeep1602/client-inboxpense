'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Icon } from './Icons';

// Define the type for a single category object received from the API
type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  matchStrings: string[];
  isDefault: boolean;
};

// Define the type for the data submitted from the "Add New" form
type CategoryFormData = {
  name: string;
  icon: string;
  color: string;
  matchStrings: string;
};

// --- Sub-component for the Delete Confirmation Dialog ---
// This keeps the delete logic clean and self-contained.
const DeleteCategoryDialog = ({
  category,
  onCategoryDeleted,
}: {
  category: Category;
  onCategoryDeleted: () => void;
}) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }
      toast.success(`Category "${category.name}" has been deleted.`);
      onCategoryDeleted(); // Notify the parent component to update its state
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* This button is positioned absolutely over the CategoryItem */}
        <Button
          variant='destructive'
          size='icon'
          className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
          onClick={(e) => e.stopPropagation()}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            <span className='font-semibold text-foreground'>
              {' '}
              {category.name}{' '}
            </span>
            category and remove it from all associated transactions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// --- Main CategoryManager Component ---
export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CategoryFormData>();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error('Could not load your categories.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (values: CategoryFormData) => {
    const matchStringsArray = values.matchStrings
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, matchStrings: matchStringsArray }),
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to create category');

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      toast.success('New category created.');
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      toast.error('Could not create category.');
    }
  };

  const handleCategoryDeleted = (deletedCategoryId: string) => {
    setCategories((prev) => prev.filter((c) => c._id !== deletedCategoryId));
    router.refresh(); // Refresh server components to update the main transaction list
  };

  return (
    <Card className='mb-6 bg-background/80 dark:bg-background/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>
          Create categories and rules to automatically sort your transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className='text-muted-foreground'>Loading categories...</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {categories.map((cat) => (
              <div key={cat._id} className='relative group'>
                <div className='flex flex-col items-center justify-center p-4 border rounded-lg space-y-2 aspect-square text-center w-full h-full'>
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center'
                    style={{ backgroundColor: `${cat.color}20` }}>
                    <Icon
                      name={cat.icon}
                      categoryName={cat.name}
                      className='h-6 w-6'
                      style={{ color: cat.color }}
                    />
                  </div>
                  <p className='font-semibold text-sm'>{cat.name}</p>
                </div>
                {!cat.isDefault && (
                  <DeleteCategoryDialog
                    category={cat}
                    onCategoryDeleted={() => handleCategoryDeleted(cat._id)}
                  />
                )}
              </div>
            ))}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className='flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg space-y-2 aspect-square text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-solid transition-all'>
                  <PlusCircle className='h-8 w-8' />
                  <p className='font-semibold text-sm text-center'>Add New</p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='space-y-4 pt-4'>
                  <div>
                    <Label htmlFor='name'>Category Name</Label>
                    <Input
                      id='name'
                      {...register('name', { required: true })}
                      placeholder='e.g., Side Hustle'
                    />
                  </div>
                  <div>
                    <Label htmlFor='icon'>Icon Name (from Lucide)</Label>
                    <Input
                      id='icon'
                      {...register('icon', { required: true })}
                      placeholder='e.g., Code'
                    />
                  </div>
                  <div>
                    <Label htmlFor='color'>Color (Hex)</Label>
                    <Input
                      id='color'
                      {...register('color')}
                      defaultValue='#888888'
                    />
                  </div>
                  <div>
                    <Label htmlFor='matchStrings'>
                      Match Strings (comma-separated)
                    </Label>
                    <Input
                      id='matchStrings'
                      {...register('matchStrings')}
                      placeholder='e.g., Upwork, Fiverr'
                    />
                  </div>
                  <DialogFooter>
                    <Button type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
