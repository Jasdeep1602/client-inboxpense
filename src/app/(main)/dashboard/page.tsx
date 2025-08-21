import { Suspense } from 'react';

import {
  TransactionsManager,
  type Transaction,
  type TransactionGroup,
} from '../../../components/TransactionsManager';
import { PaginationController } from '@/components/PaginationController';
import { authenticatedFetch } from '@/lib/api';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Header } from '@/components/Header';

// This is the correct, full type for the entire API response.
type ApiResponse = {
  type: 'list' | 'grouped';
  data: Transaction[] | TransactionGroup[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

/**
 * A clean Server Function to fetch transactions. It uses our authenticatedFetch helper
 * and is guaranteed to always return a valid ApiResponse object.
 */
async function getTransactions(
  currentPage: number,
  source: string,
  groupBy: string
): Promise<ApiResponse> {
  const defaultResponse: ApiResponse = {
    type: 'list',
    data: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  };

  try {
    // authenticatedFetch handles the cookie logic for us.
    const response = await authenticatedFetch(
      `/api/transactions?page=${currentPage}&limit=10&source=${source}&groupBy=${groupBy}`
    );

    if (!response.ok) {
      console.error('FRONTEND: API Error:', await response.text());
      return defaultResponse;
    }

    return response.json();
  } catch (error) {
    console.error('FRONTEND: Fetch Error:', error);
    return defaultResponse;
  }
}

async function TransactionsData({
  currentPage,
  currentSource,
  currentGroupBy,
}: {
  currentPage: number;
  currentSource: string;
  currentGroupBy: string;
}) {
  const { type, data, pagination } = await getTransactions(
    currentPage,
    currentSource,
    currentGroupBy
  );

  return (
    <div className='space-y-6'>
      <TransactionsManager dataType={type} transactionData={data} />
      <PaginationController totalPages={pagination.totalPages} />
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const currentSource = (params.source as string) || 'All';
  const currentGroupBy = (params.groupBy as string) || 'none';
  return (
    // We wrap the entire data-dependent section in Suspense
    <>
      {/* The Header is rendered immediately. It is NOT inside Suspense. */}
      <Header title='Dashboard' />

      {/* The main content area that will be wrapped by the layout's <main> tag */}
      <div className='p-6 pt-5'>
        <Suspense fallback={<TableSkeleton />}>
          <TransactionsData
            currentPage={currentPage}
            currentSource={currentSource}
            currentGroupBy={currentGroupBy}
          />
        </Suspense>
      </div>
    </>
  );
}
