'use client'; // This component manages state and user interaction, so it must be a client component

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';

// Defines the shape of a single transaction object that this component receives.
export type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string;
  amount: number;
  type: 'credit' | 'debit';
  mode: string;
};

// Defines the labels for the filter buttons.
const FILTER_SOURCES = ['All', 'Me', 'Mom', 'Dad'];

// A helper function to format date strings into a more readable format.
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * A client component responsible for displaying the list of transactions
 * and handling the client-side filtering logic.
 */
export const TransactionsManager = ({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) => {
  // Hooks from Next.js for managing navigation and reading URL parameters.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine the currently active filter by reading the 'source' parameter from the URL.
  // If it's not present, default to 'All'.
  const activeFilter = searchParams.get('source') || 'All';

  /**
   * Handles the click event for the filter buttons.
   * It updates the URL's query parameters to trigger a server-side refetch of the data.
   * @param source The new source to filter by.
   */
  const handleFilterChange = (source: string) => {
    console.log('Filter button clicked. Changing source to:', source);
    const params = new URLSearchParams(searchParams);

    // --- THIS IS THE FIX ---
    // When a user selects a new filter, we ALWAYS reset the page number to 1.
    // This prevents being stuck on a high page number with no results for the new filter.
    params.set('page', '1');

    // Set the new source filter.
    params.set('source', source);

    // Push the new URL to the router. This tells Next.js to re-render the page
    // with the new search parameters, causing a fresh data fetch on the server.
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Your recent financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          {/* Filter Buttons UI */}
          <div className='flex space-x-2'>
            {FILTER_SOURCES.map((source) => (
              <Button
                key={source}
                variant={activeFilter === source ? 'default' : 'secondary'}
                onClick={() => handleFilterChange(source)}>
                {source}
              </Button>
            ))}
          </div>
          <Button>+ Add Transaction</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* The component now receives the already filtered and paginated data,
                so we can just check if the array is empty. */}
            {initialTransactions.length > 0 ? (
              initialTransactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className='text-muted-foreground'>
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell
                    className='font-medium max-w-xs truncate'
                    title={tx.body}>
                    {tx.body}
                  </TableCell>
                  <TableCell>{tx.source}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === 'debit'
                        ? 'text-destructive'
                        : 'text-green-600'
                    }`}>
                    ₹{tx.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // This row is displayed if the server returns an empty array for the current filter/page.
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  No transactions found for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
