'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationControllerProps {
  totalPages: number;
}

export const PaginationController = ({
  totalPages,
}: PaginationControllerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentLimit = Number(searchParams.get('limit')) || 10;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  // --- THIS IS THE NEW FUNCTION ---
  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    params.set('page', '1'); // Reset to the first page when limit changes
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  // --- END NEW FUNCTION ---

  if (totalPages <= 1) {
    return null; // Don't render anything if there's only one page
  }

  const getPageNumbers = () => {
    const pageNumbers = new Set<number | string>();
    pageNumbers.add(1);
    if (currentPage > 3) pageNumbers.add('...');
    if (currentPage > 2) pageNumbers.add(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages)
      pageNumbers.add(currentPage);
    if (currentPage < totalPages - 1) pageNumbers.add(currentPage + 1);
    if (currentPage < totalPages - 2) pageNumbers.add('...');
    pageNumbers.add(totalPages);
    return Array.from(pageNumbers);
  };

  const pageNumbersToRender = getPageNumbers();

  return (
    // --- THIS IS THE NEW WRAPPER ---
    <div className='flex items-center justify-between w-full'>
      <div className='text-sm text-muted-foreground hidden sm:block'>
        Page {currentPage} of {totalPages}
      </div>

      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              className={
                currentPage <= 1
                  ? 'pointer-events-none text-muted-foreground'
                  : ''
              }
            />
          </PaginationItem>

          {pageNumbersToRender.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageURL(page)}
                  isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none text-muted-foreground'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className='flex items-center space-x-2 text-sm'>
        <p className='text-muted-foreground hidden md:block'>Rows per page</p>
        <Select value={String(currentLimit)} onValueChange={handleLimitChange}>
          <SelectTrigger className='w-[75px]'>
            <SelectValue placeholder={currentLimit} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='20'>20</SelectItem>
            <SelectItem value='50'>50</SelectItem>
            <SelectItem value='100'>100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    // --- END NEW WRAPPER ---
  );
};
