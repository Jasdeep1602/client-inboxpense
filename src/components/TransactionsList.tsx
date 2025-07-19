import { authenticatedFetch } from '@/lib/api'; // Use the new alias
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define the shape of a single transaction
type Transaction = {
  _id: string;
  date: string;
  body: string;
  source: string;
  amount: number;
  type: 'credit' | 'debit';
  mode: string;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const TransactionsList = async () => {
  let transactions: Transaction[] = [];
  let error: string | null = null;

  try {
    const response = await authenticatedFetch('/api/transactions');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transactions');
    }
    transactions = await response.json();
  } catch (err) {
    console.error(err);
    error = err instanceof Error ? err.message : 'An unknown error occurred.';
  }

  if (error) {
    return (
      <Card className='bg-destructive/10 border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive'>Error</CardTitle>
          <CardDescription className='text-destructive/80'>
            Could not load your transactions. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Transactions Found</CardTitle>
          <CardDescription>
            Try syncing a profile from the Settings page to see your
            transactions here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </div>
        <Button>+ Add Transaction</Button>
      </CardHeader>
      <CardContent>
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
            {transactions.map((tx) => (
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
                    tx.type === 'debit' ? 'text-red-500' : 'text-green-500'
                  }`}>
                  ₹{tx.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
