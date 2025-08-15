'use client';

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

// Define the type for a single mapping rule object
type SourceMapping = {
  _id: string;
  mappingName: string;
  matchStrings: string[];
};

// Define the type for the form data
type MappingFormData = {
  mappingName: string;
  matchStrings: string; // The input will be a single comma-separated string
};

export const SourceMappingManager = () => {
  const [mappings, setMappings] = useState<SourceMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // React Hook Form for managing the 'Add New' dialog form
  const form = useForm<MappingFormData>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = form;

  // Fetch existing mappings from the backend when the component first loads
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/mappings`,
          { credentials: 'include' }
        );
        if (!response.ok) throw new Error('Failed to fetch mappings');
        const data = await response.json();
        setMappings(data);
      } catch (error) {
        toast('Error', {
          description: 'Could not load your source mappings.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMappings();
  }, [toast]);

  // Function to handle the form submission for creating a new mapping rule
  const onSubmit = async (values: MappingFormData) => {
    // Split the comma-separated match strings into an array, trim whitespace from each, and filter out any empty strings.
    const matchStringsArray = values.matchStrings
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (matchStringsArray.length === 0) {
      setError('matchStrings', {
        type: 'manual',
        message: 'Please enter at least one match string.',
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mappings`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mappingName: values.mappingName,
            matchStrings: matchStringsArray,
          }),
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('Failed to create mapping');

      const newMapping = await response.json();
      setMappings((prev) => [...prev, newMapping]); // Optimistically add new mapping to the UI
      toast('Success!', {
        description: 'New source mapping created.',
      });
      setIsDialogOpen(false); // Close the dialog
      reset(); // Reset the form fields
    } catch (error) {
      toast('Error', {
        description: 'Could not create mapping.',
      });
    }
  };

  // Function to handle deleting a mapping rule
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mapping rule?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mappings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setMappings((prev) => prev.filter((m) => m._id !== id)); // Optimistically remove from UI
      toast('Success!', { description: 'Mapping deleted.' });
    } catch (error) {
      toast('Error', {
        description: 'Could not delete mapping.',
      });
    }
  };

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <div>
          <CardTitle>Source Mapping</CardTitle>
          <CardDescription>
            Create rules to automatically clean up transaction sources.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add New Mapping</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Source Mapping</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
              <div>
                <Label htmlFor='mappingName'>Mapping Name</Label>
                <Input
                  id='mappingName'
                  {...register('mappingName', {
                    required: 'This field is required.',
                  })}
                  placeholder='e.g., My HDFC Credit Card'
                />
                {errors.mappingName && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.mappingName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor='matchStrings'>
                  Match Strings (comma-separated)
                </Label>
                <Input
                  id='matchStrings'
                  {...register('matchStrings', {
                    required: 'This field is required.',
                  })}
                  placeholder='e.g., HDFC, XX810'
                />
                {errors.matchStrings && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.matchStrings.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Mapping'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className='text-muted-foreground'>Loading mappings...</p>
        ) : (
          <div className='space-y-4'>
            {mappings.length > 0 ? (
              mappings.map((mapping) => (
                <div
                  key={mapping._id}
                  className='flex items-center justify-between p-3 border rounded-lg bg-muted/50'>
                  <div>
                    <p className='font-semibold'>{mapping.mappingName}</p>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {mapping.matchStrings.map((str) => (
                        <Badge key={str} variant='secondary'>
                          {str}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(mapping._id)}>
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-center py-4'>
                No source mappings created yet.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
