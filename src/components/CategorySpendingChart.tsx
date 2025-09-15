'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import { CategorySpendingData } from '@/app/(main)/analytics/page'; // Import type from page

export const CategorySpendingChart = ({
  data,
  onCategorySelect,
}: {
  data: CategorySpendingData[];
  onCategorySelect: (data: CategorySpendingData) => void;
}) => {
  const { theme } = useTheme();

  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  const series =
    totalSpending > 0
      ? data.map((item) =>
          parseFloat(((item.value / totalSpending) * 100).toFixed(2))
        )
      : [];

  const labels = data.map((item) => item.name);
  const colors = data.map((item) => item.color);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 350,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          onCategorySelect(data[selectedIndex]);
        },
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '30%',
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: '14px',
            fontWeight: 'bold',
            formatter: (val) => `${val}%`,
          },
        },
        track: {
          background: theme === 'dark' ? '#374151' : '#f1f5f9',
        },
      },
    },
    colors: colors,
    labels: labels,
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
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
      enabled: true,
      y: {
        formatter: (val, { seriesIndex }) => {
          const originalDataPoint = data[seriesIndex];
          return `₹${originalDataPoint.value.toFixed(2)}`;
        },
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
          type='radialBar'
          height={350}
        />
      </CardContent>
    </Card>
  );
};
