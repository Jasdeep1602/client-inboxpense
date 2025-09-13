'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Icon, IconName } from './Icons';
import apiClient from '@/lib/apiClient';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { ColorPicker } from './ColorPicker'; // <-- IMPORT THE NEW COMPONENT
import { Controller } from 'react-hook-form'; // <-- IMPORT CONTROLLER

// --- Type Definitions ---
type Subcategory = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  subcategories: Subcategory[];
};

type CategoryFormData = {
  name: string;
  color: string;
};

// --- Add/Edit Dialog Component ---
const CategoryDialog = ({
  mode,
  category,
  parentId,
  onSuccess,
}: {
  mode: 'add' | 'edit';
  category?: Category | Subcategory;
  parentId?: string | null;
  onSuccess: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<CategoryFormData>();

  useEffect(() => {
    if (isOpen) {
      reset({
        name: category?.name || '',
        color: category?.color || '#888888',
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (values: CategoryFormData) => {
    try {
      const payload = { ...values, parentId };

      if (mode === 'edit' && category) {
        await apiClient.put(`/api/categories/${category._id}`, payload);
        toast.success(`"${values.name}" has been updated.`);
      } else {
        await apiClient.post('/api/categories', payload);
        toast.success(
          parentId
            ? `Subcategory "${values.name}" created.`
            : `Category "${values.name}" created.`
        );
      }
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const title =
    mode === 'add'
      ? parentId
        ? 'Add New Subcategory'
        : 'Add New Category'
      : `Edit "${category?.name}"`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {mode === 'add' && !parentId ? (
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' /> New Category
          </Button>
        ) : (
          <Button
            variant={mode === 'add' ? 'ghost' : 'outline'}
            size='icon'
            className='h-7 w-7'>
            {mode === 'add' ? (
              <PlusCircle className='h-4 w-4' />
            ) : (
              <Edit className='h-4 w-4' />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              {...register('name', { required: true })}
              placeholder='e.g., Groceries'
            />
          </div>
          <div>
            <Label>Color</Label>
            <Controller
              control={control}
              name='color'
              render={({ field }) => (
                <ColorPicker value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Delete Confirmation Dialog ---
const DeleteCategoryDialog = ({
  category,
  isParent,
  onSuccess,
}: {
  category: Category | Subcategory;
  isParent: boolean;
  onSuccess: () => void;
}) => {
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/api/categories/${category._id}`);
      toast.success(`"${category.name}" has been deleted.`);
      onSuccess();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='icon' className='h-7 w-7'>
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{' '}
            <span className='font-semibold text-foreground'>
              {category.name}
            </span>{' '}
            category
            {isParent && ' and all of its subcategories'}.
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
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Could not load your categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    fetchCategories();
    router.refresh();
  };

  const defaultCategories = useMemo(
    () => categories.filter((c) => c.isDefault),
    [categories]
  );
  const customCategories = useMemo(
    () => categories.filter((c) => !c.isDefault),
    [categories]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mb-6 bg-background/80 dark:bg-background/50 backdrop-blur-sm'>
      <CardHeader className='flex-row items-center justify-between'>
        <div>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Organize your spending with categories and subcategories.
          </CardDescription>
        </div>
        <CategoryDialog mode='add' onSuccess={handleSuccess} />
      </CardHeader>
      <CardContent>
        <Accordion type='multiple' className='w-full space-y-2'>
          {[...customCategories, ...defaultCategories].map((cat) => (
            <AccordionItem
              value={cat._id}
              key={cat._id}
              className='border-b-0 rounded-md bg-muted/50'>
              <div className='flex items-center p-2 rounded-md group'>
                <Icon
                  name={cat.icon as IconName}
                  categoryName={cat.name}
                  className='h-5 w-5 mr-3 flex-shrink-0'
                  style={{ color: cat.color }}
                />
                <AccordionTrigger className='flex-1 text-left font-semibold py-0 hover:no-underline'>
                  <div className='flex items-center gap-2'>
                    {cat.name}
                    {cat.subcategories.length > 0 && (
                      <Badge variant='secondary' className='h-5'>
                        {cat.subcategories.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <div className='flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <CategoryDialog
                    mode='add'
                    parentId={cat._id}
                    onSuccess={handleSuccess}
                  />
                  {!cat.isDefault && (
                    <>
                      <CategoryDialog
                        mode='edit'
                        category={cat}
                        onSuccess={handleSuccess}
                      />
                      <DeleteCategoryDialog
                        category={cat}
                        isParent={true}
                        onSuccess={handleSuccess}
                      />
                    </>
                  )}
                </div>
              </div>
              <AccordionContent className='pt-2 pb-2 pl-8 pr-2 space-y-1 border-l-2 ml-4 border-dashed'>
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className='flex items-center justify-between p-2 rounded-md hover:bg-background/50 group'>
                    <div className='flex items-center gap-3'>
                      <Icon
                        name={sub.icon as IconName}
                        categoryName={sub.name}
                        className='h-5 w-5'
                        style={{ color: sub.color }}
                      />
                      <span className='text-sm'>{sub.name}</span>
                    </div>
                    <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <CategoryDialog
                        mode='edit'
                        category={sub}
                        parentId={cat._id}
                        onSuccess={handleSuccess}
                      />
                      <DeleteCategoryDialog
                        category={sub}
                        isParent={false}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  </div>
                ))}
                {cat.subcategories.length === 0 && (
                  <p className='text-xs text-muted-foreground pl-4 py-2'>
                    No subcategories yet. Click the &#39;+&#39; to add one.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
