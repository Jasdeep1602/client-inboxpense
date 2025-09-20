import { Loader2 } from 'lucide-react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='flex h-[calc(100vh-8rem)] items-center justify-center'>
      <Loader2 className='h-12 w-12 animate-spin text-primary' />
    </div>
  );
}
