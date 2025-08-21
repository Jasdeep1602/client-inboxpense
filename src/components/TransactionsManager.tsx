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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from './Icons';
import { MoreHorizontal } from 'lucide-react';
import { TransactionDetailSheet } from './TransactionDetailSheet';
import { AddTransactionDialog } from './AddTransactionDialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Define the shape of a single transaction
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

// Define the shape for the grouped data structure
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

const formatGroupName = (period: string, groupBy: string) => {
  if (groupBy === 'month') {
    const [year, month] = period.split('-') as [string, string];
    return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }
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

const TransactionRow = ({
  tx,
  onRowClick,
}: {
  tx: Transaction;
  onRowClick: (transaction: Transaction) => void;
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
    <TableCell>
      {tx.categoryId ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted'>
                <Icon
                  name={tx.categoryId.icon}
                  categoryName={tx.categoryId.name}
                  className='h-4 w-4 text-muted-foreground'
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tx.categoryId.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted'>
          <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
        </div>
      )}
    </TableCell>
    <TableCell
      className={`text-right font-semibold ${
        tx.type === 'debit' ? 'text-destructive' : 'text-green-600'
      }`}>
      ₹{tx.amount.toFixed(2)}
    </TableCell>
    <TableCell className='text-xs text-muted-foreground italic truncate max-w-[200px]'>
      {tx.description}
    </TableCell>
  </TableRow>
);

const TransactionsTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[150px]'>Date</TableHead>
      <TableHead>Account</TableHead>
      <TableHead>Category</TableHead>
      <TableHead className='text-right'>Amount</TableHead>
      <TableHead>Description</TableHead>
    </TableRow>
  </TableHeader>
);

export const TransactionsManager = ({
  dataType,
  transactionData,
}: TransactionsManagerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const activeGroupBy = searchParams.get('groupBy') || 'none';
  const activeFilter = searchParams.get('source') || 'All';

  const handleFilterChange = (
    filterType: 'source' | 'groupBy',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set(filterType, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Card className='bg-background/80 dark:bg-background/50 backdrop-blur-sm border-border/50'>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Your financial activity</CardDescription>
          </div>
          <AddTransactionDialog />
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
            <ToggleGroup
              type='single'
              variant={'outline'}
              size={'sm'}
              defaultValue={activeFilter}
              onValueChange={(value) => {
                if (value) handleFilterChange('source', value);
              }}>
              <ToggleGroupItem value='All' aria-label='Filter All'>
                All
              </ToggleGroupItem>
              <ToggleGroupItem value='Me' aria-label='Filter Me'>
                Me
              </ToggleGroupItem>
              <ToggleGroupItem value='Mom' aria-label='Filter Mom'>
                Mom
              </ToggleGroupItem>
              <ToggleGroupItem value='Dad' aria-label='Filter Dad'>
                Dad
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type='single'
              variant={'outline'}
              size={'sm'}
              defaultValue={activeGroupBy}
              onValueChange={(value) => {
                if (value) handleFilterChange('groupBy', value);
              }}>
              <ToggleGroupItem value='none' aria-label='No grouping'>
                None
              </ToggleGroupItem>
              <ToggleGroupItem value='week' aria-label='Group by week'>
                Week
              </ToggleGroupItem>
              <ToggleGroupItem value='month' aria-label='Group by month'>
                Month
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {dataType === 'grouped' ? (
            <div className='space-y-6'>
              {(transactionData as TransactionGroup[]).map((group) => (
                <div key={group.period}>
                  <div className='flex justify-between items-center bg-muted/50 p-3 rounded-t-lg border'>
                    <h3 className='font-semibold text-sm'>
                      {formatGroupName(group.period, activeGroupBy)}
                    </h3>
                    <div className='text-xs space-x-4'>
                      <span className='text-green-600 font-medium'>
                        Credit: ₹{group.totalCredit.toFixed(2)}
                      </span>
                      <span className='text-destructive font-medium'>
                        Debit: ₹{group.totalDebit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Table>
                    <TransactionsTableHeader />
                    <TableBody>
                      {group.transactions.map((tx) => (
                        <TransactionRow
                          key={tx._id}
                          tx={tx}
                          onRowClick={setSelectedTransaction}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TransactionsTableHeader />
              <TableBody>
                {(transactionData as Transaction[]).map((tx) => (
                  <TransactionRow
                    key={tx._id}
                    tx={tx}
                    onRowClick={setSelectedTransaction}
                  />
                ))}
              </TableBody>
            </Table>
          )}

          {(!transactionData || transactionData.length === 0) && (
            <div className='text-center h-24 flex items-center justify-center text-muted-foreground'>
              No transactions found for this filter.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionDetailSheet
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onOpenChange={(open) => !open && setSelectedTransaction(null)}
        />
      )}
    </>
  );
};

// 'use client';

// import { useState } from 'react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from './ui/table';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from './ui/card';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import { Icon } from './Icons';
// import { MoreHorizontal } from 'lucide-react';
// import { TransactionDetailSheet } from './TransactionDetailSheet';
// import { AddTransactionDialog } from './AddTransactionDialog';

// // Define the shape of a single transaction
// export type Transaction = {
//   _id: string;
//   date: string;
//   body: string;
//   source: string;
//   amount: number;
//   type: 'credit' | 'debit';
//   mode: string;
//   description?: string;
//   categoryId?: {
//     _id: string;
//     name: string;
//     icon: string;
//     color: string;
//   };
// };

// // Define the shape for the grouped data structure
// export type TransactionGroup = {
//   period: string;
//   totalCredit: number;
//   totalDebit: number;
//   transactions: Transaction[];
// };

// interface TransactionsManagerProps {
//   dataType: 'list' | 'grouped';
//   transactionData: Transaction[] | TransactionGroup[];
// }
// const formatGroupName = (period: string, groupBy: string) => {
//   // Use the groupBy parameter to decide which format to use.
//   if (groupBy === 'month') {
//     // FIX: Use `of` for array destructuring and assert the type.
//     const [year, month] = period.split('-') as [string, string];

//     // Create a UTC date to avoid timezone issues.
//     return new Date(Date.UTC(Number(year), Number(month) - 1)).toLocaleString(
//       'en-US',
//       {
//         month: 'long',
//         year: 'numeric',
//         timeZone: 'UTC',
//       }
//     );
//   }

//   if (groupBy === 'week') {
//     const startDate = new Date(period);
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 6);

//     const options: Intl.DateTimeFormatOptions = {
//       month: 'short',
//       day: 'numeric',
//     };

//     if (startDate.getFullYear() !== endDate.getFullYear()) {
//       return `${startDate.toLocaleDateString('en-US', {
//         ...options,
//         year: 'numeric',
//       })} - ${endDate.toLocaleDateString('en-US', {
//         ...options,
//         year: 'numeric',
//       })}`;
//     }
//     if (startDate.getMonth() !== endDate.getMonth()) {
//       return `${startDate.toLocaleDateString(
//         'en-US',
//         options
//       )} - ${endDate.toLocaleDateString(
//         'en-US',
//         options
//       )}, ${startDate.getFullYear()}`;
//     }
//     return `${startDate.toLocaleString('en-US', {
//       month: 'short',
//     })} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
//   }

//   return period;
// };
// // --- Reusable Component for a single Table Row ---
// const TransactionRow = ({
//   tx,
//   onRowClick,
// }: {
//   tx: Transaction;
//   onRowClick: (transaction: Transaction) => void;
// }) => (
//   <TableRow
//     onClick={() => onRowClick(tx)}
//     className='cursor-pointer hover:bg-muted/50'>
//     <TableCell className='text-muted-foreground text-xs'>
//       {new Date(tx.date).toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       })}
//     </TableCell>
//     <TableCell>
//       <Badge variant='outline'>{tx.mode}</Badge>
//     </TableCell>
//     <TableCell>
//       {tx.categoryId ? (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted'>
//                 <Icon
//                   name={tx.categoryId.icon}
//                   categoryName={tx.categoryId.name}
//                   className='h-4 w-4 text-muted-foreground'
//                 />
//               </div>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>{tx.categoryId.name}</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       ) : (
//         <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted'>
//           <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
//         </div>
//       )}
//     </TableCell>
//     <TableCell className='text-xs text-muted-foreground italic truncate max-w-[200px]'>
//       {tx.description}
//     </TableCell>
//     <TableCell
//       className={`text-right font-semibold ${
//         tx.type === 'debit' ? 'text-destructive' : 'text-green-600'
//       }`}>
//       ₹{tx.amount.toFixed(2)}
//     </TableCell>
//   </TableRow>
// );

// // --- Reusable Component for the Table Header ---
// const TransactionsTableHeader = () => (
//   <TableHeader>
//     <TableRow>
//       <TableHead className='w-[150px]'>Date</TableHead>
//       <TableHead>Account</TableHead>
//       <TableHead>Category</TableHead>
//       <TableHead>Description</TableHead>

//       <TableHead className='text-right'>Amount</TableHead>
//     </TableRow>
//   </TableHeader>
// );

// export const TransactionsManager = ({
//   dataType,
//   transactionData,
// }: TransactionsManagerProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<Transaction | null>(null);
//   const activeGroupBy = searchParams.get('groupBy') || 'none';
//   const activeFilter = searchParams.get('source') || 'All';

//   const handleFilterChange = (
//     filterType: 'source' | 'groupBy',
//     value: string
//   ) => {
//     const params = new URLSearchParams(searchParams);
//     params.set('page', '1');
//     params.set(filterType, value);
//     router.push(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader className='flex-row items-center justify-between'>
//           <div>
//             <CardTitle>Transactions</CardTitle>
//             <CardDescription>Your financial activity</CardDescription>
//           </div>
//           <AddTransactionDialog />
//         </CardHeader>
//         <CardContent>
//           <div className='flex items-center justify-between mb-4 flex-wrap gap-4'>
//             <div className='flex space-x-2'>
//               {['All', 'Me', 'Mom', 'Dad'].map((source) => (
//                 <Button
//                   key={source}
//                   variant={activeFilter === source ? 'default' : 'secondary'}
//                   onClick={() => handleFilterChange('source', source)}>
//                   {source}
//                 </Button>
//               ))}
//             </div>
//             <div className='flex space-x-2'>
//               {['none', 'week', 'month'].map((group) => (
//                 <Button
//                   key={group}
//                   variant={activeGroupBy === group ? 'default' : 'outline'}
//                   size='sm'
//                   onClick={() => handleFilterChange('groupBy', group)}>
//                   {group.charAt(0).toUpperCase() + group.slice(1)}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {dataType === 'grouped' ? (
//             <div className='space-y-6'>
//               {(transactionData as TransactionGroup[]).map((group) => (
//                 <div key={group.period}>
//                   <div className='flex justify-between items-center bg-muted p-3 rounded-t-lg border'>
//                     <h3 className='font-semibold text-sm'>
//                       {formatGroupName(group.period, activeGroupBy)}
//                     </h3>
//                     <div className='text-xs space-x-4'>
//                       <span className='text-green-600 font-medium'>
//                         Credit: ₹{group.totalCredit.toFixed(2)}
//                       </span>
//                       <span className='text-destructive font-medium'>
//                         Debit: ₹{group.totalDebit.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                   <Table>
//                     <TransactionsTableHeader />
//                     <TableBody>
//                       {group.transactions.map((tx) => (
//                         <TransactionRow
//                           key={tx._id}
//                           tx={tx}
//                           onRowClick={setSelectedTransaction}
//                         />
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <Table>
//               <TransactionsTableHeader />
//               <TableBody>
//                 {(transactionData as Transaction[]).map((tx) => (
//                   <TransactionRow
//                     key={tx._id}
//                     tx={tx}
//                     onRowClick={setSelectedTransaction}
//                   />
//                 ))}
//               </TableBody>
//             </Table>
//           )}

//           {(!transactionData || transactionData.length === 0) && (
//             <div className='text-center h-24 flex items-center justify-center text-muted-foreground'>
//               No transactions found for this filter.
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {selectedTransaction && (
//         <TransactionDetailSheet
//           transaction={selectedTransaction}
//           isOpen={!!selectedTransaction}
//           onOpenChange={(open) => !open && setSelectedTransaction(null)}
//         />
//       )}
//     </>
//   );
// };
