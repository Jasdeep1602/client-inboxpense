import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MonthlySummaryChart } from '@/components/MonthlySummaryChart';
import { CategorySpendingChart } from '@/components/CategorySpendingChart';
import { authenticatedFetch } from '@/lib/api';
import { AnalyticsFilters } from '@/components/AnalyticsFilters';

// --- Revert to the correct, complex types that match your API ---
type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

type CategorySpendingData = {
  month: string;
  categories: { id: string; name: string; color: string; total: number }[];
  monthlyTotal: number;
};
// --- END TYPE REVERT ---

async function getMonthlySummary(
  source: string
): Promise<MonthlySummaryData[]> {
  try {
    const res = await authenticatedFetch(
      `/api/summary/monthly?source=${source}`
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

async function getCategorySpending(
  source: string
): Promise<CategorySpendingData[]> {
  try {
    const res = await authenticatedFetch(
      `/api/summary/spending-by-category?source=${source}`
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentSource = (params.source as string) || 'All';

  const [monthlySummary, categorySpending] = await Promise.all([
    getMonthlySummary(currentSource),
    getCategorySpending(currentSource),
  ]);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
          <CardDescription>
            An overview of your income and spending habits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsFilters />
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlySummaryChart data={monthlySummary} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {/* This now correctly passes the complex data to the smart chart component */}
            <CategorySpendingChart data={categorySpending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
