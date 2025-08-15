'use client';

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
import { Badge } from './ui/badge'; // Import the Badge component
import { EditTransactionSheet } from './EditTransactionSheet';

export type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string; // This is "Me", "Mom", "Dad"
  amount: number;
  type: 'credit' | 'debit';
  mode: string; // This will be "My ICICI Card", "GPay", etc.
  description?: string;
};

const FILTER_SOURCES = ['All', 'Me', 'Mom', 'Dad'];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const TransactionsManager = ({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('source') || 'All';

  const handleFilterChange = (source: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('source', source);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </div>
        <Button>+ Add Transaction</Button>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Profile</TableHead> {/* Renamed for clarity */}
              <TableHead>Account</TableHead> {/* ADDED NEW COLUMN HEADER */}
              <TableHead className='text-right'>Amount</TableHead>
              <TableHead className='w-[50px] text-right'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTransactions && initialTransactions.length > 0 ? (
              initialTransactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className='text-muted-foreground text-xs'>
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className='font-medium max-w-xs'>
                    <p className='truncate' title={tx.body}>
                      {tx.body}
                    </p>
                    {tx.description && (
                      <p
                        className='text-xs text-muted-foreground italic truncate'
                        title={tx.description}>
                        {tx.description}
                      </p>
                    )}
                  </TableCell>
                  {/* This column correctly shows the profile: "Me", "Mom", "Dad" */}
                  <TableCell>{tx.source}</TableCell>

                  {/* --- THIS IS THE NEW COLUMN --- */}
                  {/* This column shows the mapped name, styled as a badge */}
                  <TableCell>
                    <Badge variant='outline'>{tx.mode}</Badge>
                  </TableCell>
                  {/* --- END NEW COLUMN --- */}

                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === 'debit'
                        ? 'text-destructive'
                        : 'text-green-600'
                    }`}>
                    ₹{tx.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <EditTransactionSheet transaction={tx} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Update the colSpan to 6 to account for the new column */}
                <TableCell colSpan={6} className='h-24 text-center'>
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
