import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => (
  <div className='space-y-6'>
    {/* Skeleton for the Filter Card */}
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-1/3' />
        <Skeleton className='h-4 w-1/2' />
      </CardHeader>
      <CardContent className='flex flex-col sm:flex-row gap-4 justify-between'>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
          <Skeleton className='h-10 w-16' />
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
          <Skeleton className='h-10 w-full sm:w-48' />
          <div className='flex space-x-2'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Skeleton for the new Summary Card */}
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <Skeleton className='h-8 w-1/3' />
        <Skeleton className='h-4 w-full rounded-full' />
        <div className='space-y-2 pt-2'>
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
        </div>
      </CardContent>
    </Card>

    {/* Skeleton for the Chart Grid */}
    <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-1/4' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[300px] w-full' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-1/3' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-[300px] w-full' />
        </CardContent>
      </Card>
    </div>

    {/* Skeleton for the new Account Performance Chart */}
    <Card>
      <CardHeader>
        <Skeleton className='h-7 w-1/2' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-[350px] w-full' />
      </CardContent>
    </Card>
  </div>
);
