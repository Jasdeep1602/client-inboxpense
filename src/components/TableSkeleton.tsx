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
      <Skeleton className='h-10 w-36' />
    </CardHeader>
    <CardContent>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
        </div>
      </div>
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
              <Skeleton className='h-5 w-24' />
            </TableHead>
            <TableHead className='text-right'>
              <Skeleton className='h-5 w-24' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-5 w-24' />
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
                <Skeleton className='h-4 w-[80px]' />
              </TableCell>
              <TableCell>
                <div className='flex justify-center'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                </div>
              </TableCell>
              <TableCell className='text-right'>
                <Skeleton className='h-4 w-[60px]' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-[100px]' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
