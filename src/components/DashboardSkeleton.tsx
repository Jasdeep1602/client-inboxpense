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
      <CardContent>
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
        </div>
      </CardContent>
    </Card>

    {/* Skeleton for the Chart Grid */}
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
      <div className='lg:col-span-3'>
        <Card>
          <CardHeader>
            <Skeleton className='h-7 w-1/4' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[300px] w-full' />
          </CardContent>
        </Card>
      </div>
      <div className='lg:col-span-2'>
        <Card>
          <CardHeader>
            <Skeleton className='h-7 w-1/3' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[300px] w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
