'use client';

import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

// Define the type for a single mapping rule object
type SourceMapping = {
  _id: string;
  mappingName: string;
  matchStrings: string[];
  type: string;
};

// Define the type for the form data
type MappingFormData = {
  mappingName: string;
  matchStrings: string; // The input will be a single comma-separated string
  type: string;
};

export const SourceMappingManager = () => {
  const [mappings, setMappings] = useState<SourceMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<SourceMapping | null>(
    null
  );
  const router = useRouter();

  const form = useForm<MappingFormData>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
    setValue,
  } = form;

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await apiClient.get('/api/mappings');
        setMappings(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Fetch mappings error:', error);
        toast.error('Could not load your source mappings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMappings();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      if (editingMapping) {
        setValue('mappingName', editingMapping.mappingName);
        setValue('type', editingMapping.type);
        setValue('matchStrings', editingMapping.matchStrings.join(', '));
      } else {
        reset({ mappingName: '', type: '', matchStrings: '' });
      }
    }
  }, [isDialogOpen, editingMapping, setValue, reset]);

  const onSubmit = async (values: MappingFormData) => {
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
      if (editingMapping) {
        // Update existing mapping
        const response = await apiClient.put(
          `/api/mappings/${editingMapping._id}`,
          {
            mappingName: values.mappingName,
            matchStrings: matchStringsArray,
            type: values.type,
          }
        );
        setMappings((prev) =>
          prev.map((m) => (m._id === editingMapping._id ? response.data : m))
        );
        toast.success('Mapping updated.');
      } else {
        // Create new mapping
        const response = await apiClient.post('/api/mappings', {
          mappingName: values.mappingName,
          matchStrings: matchStringsArray,
          type: values.type,
        });
        setMappings((prev) => [...prev, response.data]);
        toast.success('New source mapping created.');
      }
      setIsDialogOpen(false);
      setEditingMapping(null);
      router.refresh();
    } catch (error) {
      console.error('Save mapping error:', error);
      toast.error('Could not save mapping.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/api/mappings/${id}`);
      setMappings((prev) => prev.filter((m) => m._id !== id));
      toast.success('Mapping deleted.');
      router.refresh();
    } catch (error) {
      console.error('Delete mapping error:', error);
      toast.error('Could not delete mapping.');
    }
  };

  const openEditDialog = (mapping: SourceMapping) => {
    setEditingMapping(mapping);
    setIsDialogOpen(true);
  };

  return (
    <Card className='mb-6 bg-background/80 dark:bg-background/50 backdrop-blur-sm'>
      <CardHeader className='flex-row items-center justify-between'>
        <div>
          <CardTitle>Source Mapping</CardTitle>
          <CardDescription>
            Create rules to automatically clean up transaction sources.
          </CardDescription>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingMapping(null);
          }}>
          <DialogTrigger asChild>
            <Button>+ Add New Mapping</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMapping ? 'Edit' : 'Create New'} Source Mapping
              </DialogTitle>
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

              <Controller
                control={control}
                name='type'
                rules={{ required: 'Please select a type.' }}
                render={({ field }) => (
                  <div>
                    <Label>Type</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an account type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Credit Card'>Credit Card</SelectItem>
                        <SelectItem value='Debit Card'>Debit Card</SelectItem>
                        <SelectItem value='Other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className='text-sm text-destructive mt-1'>
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                )}
              />
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
                    <p className='text-xs text-muted-foreground'>
                      {mapping.type}
                    </p>
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {mapping.matchStrings.map((str) => (
                        <Badge key={str} variant='secondary'>
                          {str}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => openEditDialog(mapping)}>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the &quot;
                            {mapping.mappingName}&quot; mapping rule. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(mapping._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
