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
import { EditTransactionSheet } from './EditTransactionSheet'; // Import the new modal component

// **1. Update the Transaction Type**
//    The `description` property is now included and optional.
export type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string;
  amount: number;
  type: 'credit' | 'debit';
  mode: string;
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
              <TableHead>Source</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
              {/* **2. Add the "Actions" column header** */}
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
                  {/* **3. Update the "Details" cell to show the description** */}
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
                  <TableCell>{tx.source}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === 'debit'
                        ? 'text-destructive'
                        : 'text-green-600'
                    }`}>
                    ₹{tx.amount.toFixed(2)}
                  </TableCell>
                  {/* **4. Add the new cell with the Edit button** */}
                  <TableCell className='text-right'>
                    <EditTransactionSheet transaction={tx} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* **5. Update the column span to match the new number of columns** */}
                <TableCell colSpan={5} className='h-24 text-center'>
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
