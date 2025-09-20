import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from './ui/card';

export const TableSkeleton = () => (
  <Card>
    <CardHeader className='flex-row items-center justify-between'>
      <div>
        <Skeleton className='h-8 w-32 mb-2' />
        <Skeleton className='h-4 w-48' />
      </div>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-10 w-28' />
        <Skeleton className='h-10 w-36' />
      </div>
    </CardHeader>
    <CardContent>
      <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
        </div>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
        </div>
      </div>
      {/* Desktop Skeleton */}
      <div className='hidden md:block border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[150px]'>
                <Skeleton className='h-5 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-5 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-5 w-16' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-5 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-5 w-32' />
              </TableHead>
              <TableHead className='text-right'>
                <Skeleton className='h-5 w-20' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-4 w-[120px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[80px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[110px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[150px]' />
                </TableCell>
                <TableCell className='text-right'>
                  <Skeleton className='h-4 w-[80px]' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Mobile Skeleton */}
      <div className='block md:hidden border rounded-lg'>
        <div className='flex justify-between items-center p-3 border-b'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-5 w-20' />
        </div>
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className='flex items-start justify-between p-3 border-b'>
            <div className='flex flex-col items-start gap-1.5'>
              <Skeleton className='h-6 w-24 rounded-md' />
              <Skeleton className='h-4 w-28' />
            </div>
            <Skeleton className='h-5 w-20' />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
