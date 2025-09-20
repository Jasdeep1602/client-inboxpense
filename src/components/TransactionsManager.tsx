'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
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
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon, IconName } from './Icons';
import { MoreHorizontal, Download, Plus, Minus } from 'lucide-react';
import { TransactionDetailSheet } from './TransactionDetailSheet';
import { AddTransactionDialog } from './AddTransactionDialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import apiClient from '@/lib/apiClient';
import { DateRangeFilterDialog } from './DateRangeFilterDialog'; // Import the new dialog

// --- TYPE DEFINITIONS ---
export type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string;
  amount: number;
  type: 'credit' | 'debit';
  mode: string;
  accountType?: string; // This is the new Type
  description?: string;
  subcategoryId?: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
};

export type TransactionGroup = {
  period: string;
  totalCredit: number;
  totalDebit: number;
  transactions: Transaction[];
};

interface TransactionsManagerProps {
  dataType: 'list' | 'grouped';
  transactionData: Transaction[] | TransactionGroup[];
}

// --- HELPER FUNCTIONS & SUB-COMPONENTS ---

const formatGroupName = (period: string, groupBy: string) => {
  if (!period) return 'Invalid Period'; // Safety check
  if (groupBy === 'month') {
    const [year, month] = period.split('-') as [string, string];
    return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleString(
      'en-US',
      { month: 'long', year: 'numeric', timeZone: 'UTC' }
    );
  }
  if (groupBy === 'week') {
    const startDate = new Date(period);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', {
        ...options,
        year: 'numeric',
      })} - ${endDate.toLocaleDateString('en-US', {
        ...options,
        year: 'numeric',
      })}`;
    }
    if (startDate.getMonth() !== endDate.getMonth()) {
      return `${startDate.toLocaleDateString(
        'en-US',
        options
      )} - ${endDate.toLocaleDateString(
        'en-US',
        options
      )}, ${startDate.getFullYear()}`;
    }
    return `${startDate.toLocaleString('en-US', {
      month: 'short',
    })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
  }
  return period;
};

const TransactionCategoryDisplay = ({
  subcategory,
}: {
  subcategory?: Transaction['subcategoryId'];
}) => {
  if (subcategory) {
    return (
      <Badge variant='outline' className='font-normal'>
        <Icon
          name={subcategory.icon as IconName}
          categoryName={subcategory.name}
          className='mr-2 h-4 w-4'
          style={{ color: subcategory.color }}
        />
        {subcategory.name}
      </Badge>
    );
  }

  return (
    <Badge variant='outline' className='font-normal text-muted-foreground'>
      Uncategorized
    </Badge>
  );
};

const MobileTransactionRow = ({
  tx,
  onRowClick,
}: {
  tx: Transaction;
  onRowClick: (t: Transaction) => void;
}) => (
  <div
    onClick={() => onRowClick(tx)}
    className='flex items-start justify-between p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors'>
    <div className='flex flex-col items-start gap-1.5'>
      <TransactionCategoryDisplay subcategory={tx.subcategoryId} />
      <p className='text-xs text-muted-foreground'>
        {new Date(tx.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
    <div className='flex items-center justify-end gap-1 font-semibold pt-1'>
      {tx.type === 'debit' ? (
        <Minus className='h-3 w-3 stroke-3 text-destructive' />
      ) : (
        <Plus className='h-3 w-3 stroke-3 text-blue-500' />
      )}
      <span className='text-gray-500'>₹{(tx.amount || 0).toFixed(2)}</span>
    </div>
  </div>
);

const DesktopTransactionRow = ({
  tx,
  onRowClick,
}: {
  tx: Transaction;
  onRowClick: (t: Transaction) => void;
}) => (
  <TableRow
    onClick={() => onRowClick(tx)}
    className='cursor-pointer hover:bg-muted/50'>
    <TableCell className='text-muted-foreground text-xs'>
      {new Date(tx.date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}
    </TableCell>
    <TableCell>
      <Badge variant='outline'>{tx.mode}</Badge>
    </TableCell>
    <TableCell className='text-xs text-muted-foreground'>
      {tx.accountType || '—'}
    </TableCell>
    <TableCell>
      <TransactionCategoryDisplay subcategory={tx.subcategoryId} />
    </TableCell>
    <TableCell className='text-xs text-muted-foreground truncate max-w-[100px]'>
      {tx.description}
    </TableCell>
    <TableCell className='text-right font-semibold'>
      <div className='flex items-center justify-end gap-1'>
        {tx.type === 'debit' ? (
          <Minus className='h-3 w-3 stroke-3 text-destructive' />
        ) : (
          <Plus className='h-3 w-3 stroke-3 text-blue-500' />
        )}
        <span className='text-gray-500'>₹{(tx.amount || 0).toFixed(2)}</span>
      </div>
    </TableCell>
  </TableRow>
);

const TransactionsTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[150px]'>Date</TableHead>
      <TableHead>Account</TableHead>
      <TableHead>Type</TableHead>

      <TableHead>Category</TableHead>
      <TableHead>Description</TableHead>
      <TableHead className='text-right'>Amount</TableHead>
    </TableRow>
  </TableHeader>
);

// --- MAIN COMPONENT ---
export const TransactionsManager = ({
  dataType,
  transactionData,
}: TransactionsManagerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localTransactionData, setLocalTransactionData] =
    useState(transactionData);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    setLocalTransactionData(transactionData);
  }, [transactionData]);

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    if (dataType === 'list') {
      setLocalTransactionData((prevData) =>
        (prevData as Transaction[]).map((t) =>
          t._id === updatedTransaction._id ? updatedTransaction : t
        )
      );
    } else {
      setLocalTransactionData((prevData) =>
        (prevData as TransactionGroup[]).map((group) => ({
          ...group,
          transactions: group.transactions.map((t) =>
            t._id === updatedTransaction._id ? updatedTransaction : t
          ),
        }))
      );
    }
    if (
      selectedTransaction &&
      selectedTransaction._id === updatedTransaction._id
    ) {
      setSelectedTransaction(updatedTransaction);
    }
  };

  const activeGroupBy = searchParams.get('groupBy') || 'none';
  const activeFilter = searchParams.get('source') || 'All';
  const isDateFilterApplied = !!searchParams.get('from');

  const handleFilterChange = (
    filterType: 'source' | 'groupBy',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set(filterType, value);
    if (filterType === 'groupBy') {
      params.delete('from');
      params.delete('to');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleExport = async (month: string, source: string) => {
    const toastId = toast.loading('Generating your CSV file...');
    try {
      const response = await apiClient.get('/api/export/csv', {
        params: { source, month },
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = `transactions-${source}-${month}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Your download has started.', { id: toastId });
    } catch (error) {
      console.error('CSV Export Error:', error);
      toast.error('Failed to download CSV file.', { id: toastId });
    }
  };

  const renderGroup = (group: TransactionGroup) => {
    const currentSource = searchParams.get('source') || 'All';

    return (
      <div key={group.period?.toString()}>
        <div className='flex justify-between items-center bg-muted/50 p-3 rounded-t-lg border-x border-t'>
          <h3 className='font-semibold text-sm'>
            {formatGroupName(group.period, activeGroupBy)}
          </h3>
          <div className='flex items-center text-xs space-x-4'>
            <span className='text-green-600 font-medium'>
              Credit: ₹{(group.totalCredit || 0).toFixed(2)}
            </span>
            <span className='text-destructive font-medium'>
              Debit: ₹{(group.totalDebit || 0).toFixed(2)}
            </span>
            {activeGroupBy === 'month' && (
              <button
                onClick={() => {
                  if (group.period) {
                    handleExport(group.period, currentSource);
                  }
                }}
                title={`Download CSV for ${formatGroupName(
                  group.period,
                  activeGroupBy
                )}`}>
                <Download className='h-4 w-4 text-muted-foreground hover:text-foreground transition-colors' />
              </button>
            )}
          </div>
        </div>
        <div className='hidden md:block border-b border-x'>
          <Table>
            <TransactionsTableHeader />
            <TableBody>
              {(group.transactions || []).map((tx) => (
                <DesktopTransactionRow
                  key={tx._id}
                  tx={tx}
                  onRowClick={setSelectedTransaction}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='block md:hidden border-b border-x rounded-b-lg'>
          <div className='flex justify-between items-center p-3 border-b bg-muted/30'>
            <p className='text-xs font-semibold text-muted-foreground'>
              Details
            </p>
            <p className='text-xs font-semibold text-muted-foreground'>
              Amount
            </p>
          </div>
          {(group.transactions || []).map((tx) => (
            <MobileTransactionRow
              key={tx._id}
              tx={tx}
              onRowClick={setSelectedTransaction}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className='bg-background/80 dark:bg-background/50 backdrop-blur-sm border-border/50'>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Your financial activity</CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <DateRangeFilterDialog />
            <AddTransactionDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
            <ToggleGroup
              type='single'
              variant={'outline'}
              defaultValue={activeFilter}
              onValueChange={(v) => v && handleFilterChange('source', v)}>
              <ToggleGroupItem value='All'>All</ToggleGroupItem>
              <ToggleGroupItem value='Me'>Me</ToggleGroupItem>
              <ToggleGroupItem value='Mom'>Mom</ToggleGroupItem>
              <ToggleGroupItem value='Dad'>Dad</ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type='single'
              variant={'outline'}
              defaultValue={activeGroupBy}
              onValueChange={(v) => v && handleFilterChange('groupBy', v)}
              disabled={isDateFilterApplied}>
              <ToggleGroupItem value='none'>None</ToggleGroupItem>
              <ToggleGroupItem value='week'>Week</ToggleGroupItem>
              <ToggleGroupItem value='month'>Month</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {dataType === 'grouped' ? (
            <div className='space-y-6'>
              {(localTransactionData as TransactionGroup[]).map(renderGroup)}
            </div>
          ) : (
            <>
              <div className='hidden md:block border rounded-lg'>
                <Table>
                  <TransactionsTableHeader />
                  <TableBody>
                    {(localTransactionData as Transaction[]).map(
                      (tx, index) => (
                        <DesktopTransactionRow
                          key={tx._id || index}
                          tx={tx}
                          onRowClick={setSelectedTransaction}
                        />
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='block md:hidden border rounded-lg'>
                <div className='flex justify-between items-center p-3 border-b bg-muted/30'>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Details
                  </p>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Amount
                  </p>
                </div>
                {(localTransactionData as Transaction[]).map((tx, index) => (
                  <MobileTransactionRow
                    key={tx._id || index}
                    tx={tx}
                    onRowClick={setSelectedTransaction}
                  />
                ))}
              </div>
            </>
          )}

          {(!localTransactionData || localTransactionData.length === 0) && (
            <div className='text-center h-24 flex items-center justify-center text-muted-foreground'>
              No transactions found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionDetailSheet
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
          onTransactionUpdate={handleTransactionUpdate}
        />
      )}
    </>
  );
};
