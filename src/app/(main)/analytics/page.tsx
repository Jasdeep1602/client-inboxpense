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
import {
  AnalyticsFilters,
  AnalyticsPeriodFilters,
} from '@/components/AnalyticsFilters';

// --- Type Definitions for API Data ---
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

// --- Data Fetching Functions ---
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
    console.error('Failed to fetch monthly summary:', error);
    return [];
  }
}

async function getCategorySpending(
  source: string,
  period: string
): Promise<CategorySpendingData[]> {
  try {
    const res = await authenticatedFetch(
      `/api/summary/spending-by-category?source=${source}&period=${period}`
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch category spending:', error);
    return [];
  }
}

/**
 * The main server component for the Analytics page.
 * It is now completely free of security logic.
 */
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // --- NO MORE COOKIE CHECKS OR REDIRECTS ---
  // If this code runs, the user is authenticated, guaranteed by middleware.ts.

  const currentSource = (searchParams.source as string) || 'All';
  const currentPeriod = (searchParams.period as string) || '6m';

  const [monthlySummary, categorySpending] = await Promise.all([
    getMonthlySummary(currentSource),
    getCategorySpending(currentSource, currentPeriod),
  ]);

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
          <CardDescription>
            An overview of your income and spending habits. Filter by profile
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsFilters />
        </CardContent>
      </Card>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlySummaryChart data={monthlySummary} />
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Spending by Category</CardTitle>
              <AnalyticsPeriodFilters />
            </CardHeader>
            <CardContent>
              <CategorySpendingChart data={categorySpending} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
