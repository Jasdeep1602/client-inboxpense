import {
  TransactionsManager,
  type Transaction,
  type TransactionGroup,
} from '@/components/TransactionsManager';
import { PaginationController } from '@/components/PaginationController';
import { authenticatedFetch } from '@/lib/api'; // We use our helper for clean data fetching

// Define the shape of the API response from our backend.
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
 * A Server Function to fetch transactions. It is now cleaner because
 * the authenticatedFetch helper handles the cookie logic.
 */
async function getTransactions(
  currentPage: number,
  source: string,
  groupBy: string
): Promise<ApiResponse> {
  const defaultResponse = {
    type: 'list' as const,
    data: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  };

  try {
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
 * It is now much cleaner as the middleware handles security.
 * It remains an 'async' function because it needs to 'await' the data fetching.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- All cookie checks and redirects are now REMOVED from this page. ---
  // The middleware protects this route before this code even runs.

  const currentPage = Number(searchParams['page']) || 1;
  const currentSource = (searchParams['source'] as string) || 'All';
  const currentGroupBy = (searchParams['groupBy'] as string) || 'none';

  // We still `await` the result of our data fetching function.
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
