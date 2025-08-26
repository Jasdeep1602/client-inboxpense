'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MonthlySummaryChart } from '@/components/MonthlySummaryChart';
import { CategorySpendingChart } from '@/components/CategorySpendingChart';
import { AnalyticsDetailSheet } from '@/components/AnalyticsDetailSheet';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';

// --- Type Definitions for API Data ---
type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

type CategorySpendingData = {
  month: string;
  categories: { name: string; color: string; total: number }[];
  monthlyTotal: number;
};

type AggregatedCategoryData = {
  name: string;
  value: number;
  color: string;
};

type DetailData =
  | { type: 'month'; month: string; totalCredit: number; totalDebit: number }
  | { type: 'category'; name: string; value: number; color: string };

// --- Main Data Display Component ---
function AnalyticsData({
  initialMonthlySummary,
  initialCategorySpending,
}: {
  initialMonthlySummary: MonthlySummaryData[];
  initialCategorySpending: CategorySpendingData[];
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<DetailData | null>(null);

  const handleMonthSelect = (data: MonthlySummaryData) => {
    setSelectedData({ type: 'month', ...data });
    setIsSheetOpen(true);
  };

  const handleCategorySelect = (data: AggregatedCategoryData) => {
    setSelectedData({ type: 'category', ...data });
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <MonthlySummaryChart
            data={initialMonthlySummary}
            onMonthSelect={handleMonthSelect}
          />
        </div>
        <div className='lg:col-span-2'>
          <CategorySpendingChart
            data={initialCategorySpending}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>
      <AnalyticsDetailSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        data={selectedData}
      />
    </>
  );
}

// --- THIS IS THE NEW CLIENT COMPONENT THAT USES THE HOOKS ---
function AnalyticsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSource = searchParams.get('source') || 'All';
  const currentPeriod = searchParams.get('period') || '6m';

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryData[]>(
    []
  );
  const [categorySpending, setCategorySpending] = useState<
    CategorySpendingData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [monthlyRes, categoryRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/summary/monthly?source=${currentSource}`,
            { credentials: 'include' }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/summary/spending-by-category?source=${currentSource}&period=${currentPeriod}`,
            { credentials: 'include' }
          ),
        ]);

        if (!monthlyRes.ok || !categoryRes.ok) {
          throw new Error('Failed to fetch analytics data from the server.');
        }

        const monthlyData = await monthlyRes.json();
        const categoryData = await categoryRes.json();

        setMonthlySummary(Array.isArray(monthlyData) ? monthlyData : []);
        setCategorySpending(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setMonthlySummary([]);
        setCategorySpending([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentSource, currentPeriod]);

  const handleFilterChange = (
    filterType: 'source' | 'period',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set(filterType, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className='p-4 sm:p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
          <CardDescription>
            Visualize your spending patterns across different profiles and time
            periods.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col sm:flex-row gap-4 justify-between'>
          <ToggleGroup
            type='single'
            variant={'outline'}
            defaultValue={currentSource}
            onValueChange={(v) => v && handleFilterChange('source', v)}>
            <ToggleGroupItem value='All'>All</ToggleGroupItem>
            <ToggleGroupItem value='Me'>Me</ToggleGroupItem>
            <ToggleGroupItem value='Mom'>Mom</ToggleGroupItem>
            <ToggleGroupItem value='Dad'>Dad</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type='single'
            variant={'outline'}
            defaultValue={currentPeriod}
            onValueChange={(v) => v && handleFilterChange('period', v)}>
            <ToggleGroupItem value='30d'>30 Days</ToggleGroupItem>
            <ToggleGroupItem value='3m'>3 Months</ToggleGroupItem>
            <ToggleGroupItem value='6m'>6 Months</ToggleGroupItem>
            <ToggleGroupItem value='all'>All Time</ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <AnalyticsData
          initialMonthlySummary={monthlySummary}
          initialCategorySpending={categorySpending}
        />
      )}
    </div>
  );
}

// --- THE MAIN PAGE COMPONENT IS NOW A WRAPPER ---
// It is NOT a client component, so it can be prerendered.
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AnalyticsView />
    </Suspense>
  );
}
