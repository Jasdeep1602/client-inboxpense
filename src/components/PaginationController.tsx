'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControllerProps {
  totalPages: number;
}

export const PaginationController = ({
  totalPages,
}: PaginationControllerProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // FIX: This function should accept number or string to be safe.
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
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
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
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

        {/* Page Number Links */}
        {pageNumbersToRender.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {/* FIX: Check if the item is an ellipsis string */}
            {typeof page === 'string' ? (
              <PaginationEllipsis />
            ) : (
              // If it's not a string, it must be a number, so it's safe to render a link
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
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
  );
};
