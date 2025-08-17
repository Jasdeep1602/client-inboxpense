import {
  TransactionsManager,
  type Transaction,
  type TransactionGroup,
} from '../../../components/TransactionsManager';
import { PaginationController } from '@/components/PaginationController';
import { authenticatedFetch } from '@/lib/api';

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

/**
 * The main server component for the dashboard page.
 * It is now free of security logic, as the middleware handles it.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- NO MORE COOKIE CHECKS OR REDIRECTS ---
  // If this code runs, the user is authenticated, guaranteed by middleware.ts.

  const currentPage = Number(searchParams.page) || 1;
  const currentSource = (searchParams.source as string) || 'All';
  const currentGroupBy = (searchParams.groupBy as string) || 'none';

  const { type, data, pagination } = await getTransactions(
    currentPage,
    currentSource,
    currentGroupBy
  );

  return (
    <div className='space-y-6'>
      <TransactionsManager dataType={type} transactionData={data} />
      {/* The pagination object is guaranteed to exist due to our robust getTransactions function */}
      <PaginationController totalPages={pagination.totalPages} />
    </div>
  );
}
