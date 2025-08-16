/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; // Keep using sonner as you had before
import { PlusCircle } from 'lucide-react';
import { Icon } from './Icons'; // Import our new dynamic Icon component

// Define the type for a single category object
type Category = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  matchStrings: string[];
};

// Define the type for the form data
type CategoryFormData = {
  name: string;
  icon: string;
  color: string;
  matchStrings: string;
};

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>();

  // Fetch existing categories when the component loads
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
        // Using the sonner toast syntax you had before
        toast.error('Could not load your categories.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []); // Removed toast from dependency array as it's a stable function

  // Handle form submission for creating a new category
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
      // Using the sonner toast syntax you had before
      toast.success('New category created.');
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Using the sonner toast syntax you had before
      toast.error('Could not create category.');
    }
  };

  return (
    <Card>
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
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {/* Display existing categories */}
            {categories.map((cat) => (
              <div
                key={cat._id}
                className='flex flex-col items-center justify-center p-4 border rounded-lg space-y-2 aspect-square text-center'>
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center'
                  style={{ backgroundColor: `${cat.color}20` }}>
                  <Icon
                    name={cat.icon as any}
                    className='h-6 w-6'
                    style={{ color: cat.color }}
                  />
                </div>
                <p className='font-semibold text-sm'>{cat.name}</p>
              </div>
            ))}
            {/* "Add New" button as a grid item */}
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
                      placeholder='e.g., Food & Dining'
                    />
                  </div>
                  <div>
                    <Label htmlFor='icon'>Icon Name (from Lucide)</Label>
                    <Input
                      id='icon'
                      {...register('icon', { required: true })}
                      placeholder='e.g., UtensilsCrossed'
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
                      placeholder='e.g., Zomato, Swiggy'
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
