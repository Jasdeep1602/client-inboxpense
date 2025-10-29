'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/apiClient';

interface OverviewData {
  totalBudget: number;
  totalExpenses: number;
  totalInvestments: number;
}

const ProgressBar = ({
  budget,
  expenses,
  investments,
}: {
  budget: number;
  expenses: number;
  investments: number;
}) => {
  const totalSpent = expenses + investments;
  const isOverBudget = totalSpent > budget;

  if (isOverBudget) {
    return (
      <div className='w-full bg-destructive/20 h-3 rounded-lg overflow-hidden'>
        <div
          className='bg-destructive h-full transition-all duration-500 ease-out'
          style={{ width: '100%' }}
        />
      </div>
    );
  }

  const expensePercentage = budget > 0 ? (expenses / budget) * 100 : 0;
  const investmentPercentage = budget > 0 ? (investments / budget) * 100 : 0;

  return (
    <div className='w-full bg-muted h-3 rounded-lg flex overflow-hidden'>
      <div
        className='bg-emerald-500 h-full transition-all duration-500 ease-out'
        style={{ width: `${expensePercentage}%` }}
      />
      <div
        className='bg-sky-500 h-full transition-all duration-500 ease-out'
        style={{ width: `${investmentPercentage}%` }}
      />
    </div>
  );
};

const LegendItem = ({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) => (
  <div className='flex items-center justify-between text-sm'>
    <div className='flex items-center gap-2'>
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <p className='text-muted-foreground'>{label}</p>
    </div>
    <p className='font-mono font-semibold text-foreground'>
      ₹{value.toFixed(2)}
    </p>
  </div>
);

export const CurrentMonthSummaryCard = ({ source }: { source: string }) => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/api/summary/current-month-overview?source=${source}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [source]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-1/2' />
          <Skeleton className='h-3 w-1/3' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='h-3 w-full rounded-full' />
          <div className='space-y-2 pt-2'>
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-full' />
            <Skeleton className='h-5 w-full' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalBudget <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Month Summary</CardTitle>
          <CardDescription>
            Your budget performance for this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center h-24'>
            <p className='text-sm text-muted-foreground text-center'>
              No budget transactions found for the current month.
              <br />
              Categorize an income transaction under the &apos;Budget&apos;
              group to start.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { totalBudget, totalExpenses, totalInvestments } = data;
  const totalSpent = totalExpenses + totalInvestments;
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Month Summary</CardTitle>
        <CardDescription>
          Your budget performance for this month.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-baseline justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Total Budget</p>
            <p className='text-2xl font-bold'>₹{totalBudget.toFixed(2)}</p>
          </div>
          {isOverBudget ? (
            <div className='text-right'>
              <p className='text-xs text-destructive'>Over Budget By</p>
              <p className='text-xl font-bold text-destructive'>
                ₹{Math.abs(remaining).toFixed(2)}
              </p>
            </div>
          ) : (
            <div className='text-right'>
              <p className='text-xs text-muted-foreground'>Remaining</p>
              <p className='text-xl font-bold text-emerald-500'>
                ₹{remaining.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        <ProgressBar
          budget={totalBudget}
          expenses={totalExpenses}
          investments={totalInvestments}
        />
        <div className='space-y-3 pt-2'>
          <LegendItem
            color='bg-emerald-500'
            label='Expenses'
            value={totalExpenses}
          />
          <LegendItem
            color='bg-sky-500'
            label='Investments'
            value={totalInvestments}
          />
        </div>
      </CardContent>
    </Card>
  );
};
