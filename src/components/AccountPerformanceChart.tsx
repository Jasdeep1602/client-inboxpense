'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';

type AccountData = {
  account: string;
  totalCredit: number;
  totalDebit: number;
};

export const AccountPerformanceChart = ({ data }: { data: AccountData[] }) => {
  const { theme } = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.account),
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => {
          const num = Number(val);
          return Number.isFinite(num)
            ? `₹${(num / 1000).toFixed(0)}k`
            : String(val);
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#cbd5e1' : '#475569',
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      theme: theme === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val) => `₹${val.toFixed(2)}`,
      },
    },
    colors: ['#22c55e', '#ef4444'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#64748b' },
    },
    grid: {
      borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
  };

  const series = [
    { name: 'Credit', data: data.map((d) => d.totalCredit) },
    { name: 'Debit', data: data.map((d) => d.totalDebit) },
  ];

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Summary by Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[350px] flex items-center justify-center text-muted-foreground text-sm'>
            No data available for mapped accounts in this period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <ApexChart
          options={chartOptions}
          series={series}
          type='bar'
          height={350}
        />
      </CardContent>
    </Card>
  );
};
