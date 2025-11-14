'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import { CategorySpendingData } from '@/app/(main)/analytics/page'; // Import type from page
import { CHART_COLOR_PALETTE } from '@/lib/colors';

export const CategorySpendingChart = ({
  data,
  onCategorySelect,
}: {
  data: CategorySpendingData[];
  onCategorySelect: (data: CategorySpendingData) => void;
}) => {
  const { theme } = useTheme();

  const series = data.map((item) => item.value);
  const labels = data.map((item) => item.name);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onCategorySelect(data[config.dataPointIndex]);
        },
      },
    },
    labels: labels,
    colors: CHART_COLOR_PALETTE,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Spent',
              fontSize: '14px',
              color: theme === 'dark' ? '#9ca3af' : '#64748b',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return `₹${total.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
        },
        expandOnClick: false,
      },
    },
    // --- THIS IS THE DEFINITIVE FIX ---
    // We use 'as any' here to bypass the incorrect TypeScript type
    // definitions for this specific part of the ApexCharts library.
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    } satisfies ApexOptions['states'],
    // --- END FIX ---
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      labels: {
        colors: theme === 'dark' ? '#9ca3af' : '#64748b',
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `₹${val.toFixed(2)}`,
      },
    },
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[350px] flex items-center justify-center text-muted-foreground text-sm'>
            No categorized spending to display.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexChart
          options={chartOptions}
          series={series}
          type='donut'
          height={350}
        />
      </CardContent>
    </Card>
  );
};
