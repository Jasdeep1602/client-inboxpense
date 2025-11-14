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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategorySpendingChart } from '@/components/CategorySpendingChart';
import { AnalyticsDetailSheet } from '@/components/AnalyticsDetailSheet';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { CurrentMonthSummaryCard } from '@/components/CurrentMonthSummaryCard';
import { AccountPerformanceChart } from '@/components/AccountPerformanceChart';
import apiClient from '@/lib/apiClient';
import { subMonths, format } from 'date-fns';

// --- Type Definitions for API Data ---
export type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

export type AccountData = {
  account: string;
  totalDebit: number;
};

export type CategorySpendingData = {
  parentId: string;
  name: string;
  color: string;
  value: number;
};

export type SubcategoryBreakdownData = {
  name: string;
  color: string;
  total: number;
};

export type SourceMapping = {
  _id: string;
  mappingName: string;
};

export type DetailData =
  | { type: 'month'; data: MonthlySummaryData }
  | { type: 'category'; data: CategorySpendingData };

// --- Main Data Display Component ---
function AnalyticsData({
  categorySpending,
  accountPerformance,
  currentSource,
  currentMonth,
}: {
  categorySpending: CategorySpendingData[];
  accountPerformance: AccountData[];
  currentSource: string;
  currentMonth: string;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<DetailData | null>(null);

  const handleCategorySelect = (data: CategorySpendingData) => {
    setSelectedData({ type: 'category', data });
    setIsSheetOpen(true);
  };

  return (
    <>
      <CurrentMonthSummaryCard source={currentSource} month={currentMonth} />
      <div className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
        <CategorySpendingChart
          data={categorySpending}
          onCategorySelect={handleCategorySelect}
        />
        <AccountPerformanceChart data={accountPerformance} />
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
  const currentMonth =
    searchParams.get('month') || format(new Date(), 'yyyy-MM');

  const [categorySpending, setCategorySpending] = useState<
    CategorySpendingData[]
  >([]);
  const [accountPerformance, setAccountPerformance] = useState<AccountData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate the last 12 months for the dropdown
  const monthOptions = Array.from({ length: 13 }).map((_, i) => {
    if (i === 0) {
      return {
        value: format(new Date(), 'yyyy-MM'),
        label: 'Current Month',
      };
    }
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoryRes, accountPerformanceRes] = await Promise.all([
          apiClient.get(
            `/api/summary/spending-by-category?source=${currentSource}&month=${currentMonth}`
          ),
          apiClient.get(`/api/summary/by-account?month=${currentMonth}`),
        ]);

        setCategorySpending(
          Array.isArray(categoryRes.data) ? categoryRes.data : []
        );
        setAccountPerformance(
          Array.isArray(accountPerformanceRes.data)
            ? accountPerformanceRes.data
            : []
        );
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setCategorySpending([]);
        setAccountPerformance([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentSource, currentMonth]);

  const handleFilterChange = (
    filterType: 'source' | 'month',
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);
    params.set(filterType, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const selectedMonthLabel =
    monthOptions.find((opt) => opt.value === currentMonth)?.label ||
    'Select a month';
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
        <CardContent className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
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
          <Select
            value={currentMonth}
            onValueChange={(v) => handleFilterChange('month', v)}>
            <SelectTrigger className='w-full sm:w-[200px]'>
              <SelectValue>{selectedMonthLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <AnalyticsData
          categorySpending={categorySpending}
          accountPerformance={accountPerformance}
          currentSource={currentSource}
          currentMonth={currentMonth}
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
