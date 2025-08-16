import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  TransactionsManager,
  type Transaction,
  type TransactionGroup,
} from '../../../components/TransactionsManager';
import { PaginationController } from '@/components/PaginationController';
import { SyncManager } from '@/components/SyncManager';

// Define the shape of the API response, which can now have two different data types.
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
 * A Server Function to fetch transactions from the backend.
 * It now includes the `groupBy` parameter to support time-based grouping.
 */
async function getTransactions(
  currentPage: number,
  source: string,
  groupBy: string
): Promise<ApiResponse> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) {
    // Return a default empty state if the user is not authenticated.
    return {
      type: 'list',
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  }

  // Construct the API URL with all three dynamic parameters.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions?page=${currentPage}&limit=10&source=${source}&groupBy=${groupBy}`;
  console.log(`--- FRONTEND: Fetching from API: ${apiUrl} ---`);

  try {
    const response = await fetch(apiUrl, {
      headers: { Cookie: `jwt=${jwt}` },
      cache: 'no-store', // Ensures fresh data on every request
    });

    if (!response.ok) {
      console.error('FRONTEND: API Error:', await response.text());
      return {
        type: 'list',
        data: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('FRONTEND: Fetch Error:', error);
    return {
      type: 'list',
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  }
}

/**
 * The main server component for the dashboard page.
 * It reads all filter parameters from the URL, fetches the appropriate data,
 * and passes it down to the client components.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) redirect('/');

  // Read all three parameters from the URL, providing safe defaults.
  const currentPage = Number(searchParams['page']) || 1;
  const currentSource = (searchParams['source'] as string) || 'All';
  const currentGroupBy = (searchParams['groupBy'] as string) || 'none';

  console.log(
    `FRONTEND: Rendering for page: ${currentPage}, source: ${currentSource}, groupBy: ${currentGroupBy}`
  );

  // Fetch the data from the backend using all three parameters.
  const { type, data, pagination } = await getTransactions(
    currentPage,
    currentSource,
    currentGroupBy
  );

  return (
    // Note: The SyncManager has been removed from here as it is now on the Settings page.
    <div className='space-y-6'>
      <TransactionsManager dataType={type} transactionData={data} />
      <PaginationController totalPages={pagination.totalPages} />
    </div>
  );
}
