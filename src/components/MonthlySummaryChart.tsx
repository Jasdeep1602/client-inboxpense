'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';

type MonthlySummaryData = {
  month: string;
  totalCredit: number;
  totalDebit: number;
};

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
    month: 'short',
  });
};

export const MonthlySummaryChart = ({
  data,
}: {
  data: MonthlySummaryData[];
}) => {
  // --- Prepare the data and options for ApexCharts ---
  const categories = data.map((item) => formatMonth(item.month));
  const creditData = data.map((item) => item.totalCredit);
  const debitData = data.map((item) => item.totalDebit);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: categories, labels: { style: { colors: '#64748b' } } },
    yaxis: {
      title: { text: undefined },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => `₹${val / 1000}k`,
      },
    },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val) => `₹${val.toFixed(2)}` } },
    colors: ['#22c55e', '#ef4444'], // Green for credit, Red for debit
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 10,
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
      <div className='h-[300px] flex items-center justify-center text-muted-foreground text-sm'>
        No monthly data to display.
      </div>
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
          type='bar'
          height={300}
        />
      </CardContent>
    </Card>
  );
};
