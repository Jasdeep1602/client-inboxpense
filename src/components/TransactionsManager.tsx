'use client';

import { useState } from 'react';
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
import { Badge } from './ui/badge';
import { TransactionDetailSheet } from './TransactionDetailSheet';

export type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string;
  amount: number;
  type: 'credit' | 'debit';
  mode: string;
  description?: string;
  categoryId?: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
};

const FILTER_SOURCES = ['All', 'Me', 'Mom', 'Dad'];

const formatDateForTable = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleFilterChange = (source: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('source', source);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
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
                <TableHead className='w-[150px]'>Date</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialTransactions && initialTransactions.length > 0 ? (
                initialTransactions.map((tx) => (
                  <TableRow
                    key={tx._id}
                    onClick={() => setSelectedTransaction(tx)}
                    className='cursor-pointer hover:bg-muted/50'>
                    <TableCell className='text-muted-foreground text-xs'>
                      {formatDateForTable(tx.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{tx.mode}</Badge>
                    </TableCell>
                    {/* The category is now a simple, non-interactive badge */}
                    <TableCell>
                      {tx.categoryId ? (
                        <Badge
                          variant='outline'
                          style={{
                            borderColor: tx.categoryId.color,
                            color: tx.categoryId.color,
                          }}>
                          {tx.categoryId.name}
                        </Badge>
                      ) : (
                        <span className='text-xs text-muted-foreground'>
                          Uncategorized
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-xs text-muted-foreground italic truncate max-w-[200px]'>
                      {tx.description}
                    </TableCell>
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
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionDetailSheet
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTransaction(null);
            }
          }}
        />
      )}
    </>
  );
};
