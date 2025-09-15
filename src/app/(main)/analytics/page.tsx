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
import apiClient from '@/lib/apiClient';

// --- Type Definitions for API Data ---
export type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

// This now represents a PARENT category's aggregated spending
export type CategorySpendingData = {
  parentId: string;
  name: string;
  color: string;
  value: number;
};

// This type is for the drill-down data, exported for use in the sheet
export type SubcategoryBreakdownData = {
  name: string;
  color: string;
  total: number;
};

// The data passed to the detail sheet
export type DetailData =
  | { type: 'month'; data: MonthlySummaryData }
  | { type: 'category'; data: CategorySpendingData };

// --- Main Data Display Component ---
function AnalyticsData({
  monthlySummary,
  categorySpending,
}: {
  monthlySummary: MonthlySummaryData[];
  categorySpending: CategorySpendingData[];
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<DetailData | null>(null);

  const handleMonthSelect = (data: MonthlySummaryData) => {
    setSelectedData({ type: 'month', data });
    setIsSheetOpen(true);
  };

  const handleCategorySelect = (data: CategorySpendingData) => {
    setSelectedData({ type: 'category', data });
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <MonthlySummaryChart
            data={monthlySummary}
            onMonthSelect={handleMonthSelect}
          />
        </div>
        <div className='lg:col-span-2'>
          <CategorySpendingChart
            data={categorySpending}
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

// --- Main Client Component That Fetches Data ---
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
          apiClient.get(`/api/summary/monthly?source=${currentSource}`),
          apiClient.get(
            `/api/summary/spending-by-category?source=${currentSource}&period=${currentPeriod}`
          ),
        ]);

        setMonthlySummary(
          Array.isArray(monthlyRes.data) ? monthlyRes.data : []
        );
        setCategorySpending(
          Array.isArray(categoryRes.data) ? categoryRes.data : []
        );
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
          monthlySummary={monthlySummary}
          categorySpending={categorySpending}
        />
      )}
    </div>
  );
}

// --- The Main Page Component Wrapper ---
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AnalyticsView />
    </Suspense>
  );
}
