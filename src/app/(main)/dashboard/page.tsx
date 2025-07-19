import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  TransactionsManager,
  type Transaction,
} from '../../../components/TransactionsManager';
import { PaginationController } from '@/components/PaginationController';

type ApiResponse = {
  data: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};

// --- THIS IS THE FIX (PART 1) ---
// The data fetching function MUST accept the source filter as an argument.
async function getPaginatedTransactions(
  currentPage: number,
  source: string // <-- Added source parameter
): Promise<ApiResponse> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) {
    return {
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  }

  // Now, the API URL will correctly include the source filter.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/transactions?page=${currentPage}&limit=10&source=${source}`;
  console.log(`--- FRONTEND: Fetching from API: ${apiUrl} ---`);

  try {
    const response = await fetch(apiUrl, {
      headers: { Cookie: `jwt=${jwt}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('FRONTEND: API Error:', await response.text());
      return {
        data: [],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
      };
    }

    const result = await response.json();
    console.log(
      `FRONTEND: Successfully received ${result.data.length} transactions for source "${source}".`
    );
    return result;
  } catch (error) {
    console.error('FRONTEND: Fetch Error:', error);
    return {
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;
  if (!jwt) redirect('/');

  // --- THIS IS THE FIX (PART 2) ---
  // Read both 'page' and 'source' from the URL search parameters.
  const currentPage = Number(searchParams['page']) || 1;
  const currentSource = (searchParams['source'] as string) || 'All'; // Default to 'All'

  console.log(
    `FRONTEND: DashboardPage rendering for page: ${currentPage}, source: ${currentSource}`
  );

  // Pass BOTH parameters to the data fetching function.
  const { data: transactions, pagination } = await getPaginatedTransactions(
    currentPage,
    currentSource
  );

  return (
    <div className='space-y-6'>
      <TransactionsManager initialTransactions={transactions} />
      <PaginationController totalPages={pagination.totalPages} />
    </div>
  );
}
