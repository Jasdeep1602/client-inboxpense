'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';

type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

const formatCategoryLabel = (dateStr: string, period: string) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (period === 'current' || period === 'lastMonth') {
    // For daily views, show the day of the month
    return date.getUTCDate().toString();
  }
  // For monthly views, show the short month name
  return date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
};

export const MonthlySummaryChart = ({
  data,
  onMonthSelect,
}: {
  data: MonthlySummaryData[];
  onMonthSelect: (data: MonthlySummaryData) => void;
}) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || '6m';

  const categories = data.map((item) =>
    formatCategoryLabel(item.month, currentPeriod)
  );
  const creditData = data.map((item) => item.totalCredit);
  const debitData = data.map((item) => item.totalDebit);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      events: {
        markerClick: (event, chartContext, { dataPointIndex }) => {
          onMonthSelect(data[dataPointIndex]);
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: { categories: categories, labels: { style: { colors: '#64748b' } } },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => `₹${val / 1000}k`,
      },
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
      y: { formatter: (val) => `₹${val.toFixed(2)}` },
    },
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 5,
      labels: { colors: '#64748b' },
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
  };

  const series = [
    { name: 'Credit', data: creditData },
    { name: 'Debit', data: debitData },
  ];

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[350px] flex items-center justify-center text-muted-foreground text-sm'>
            No monthly data to display.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexChart
          options={chartOptions}
          series={series}
          type='line'
          height={350}
        />
      </CardContent>
    </Card>
  );
};
