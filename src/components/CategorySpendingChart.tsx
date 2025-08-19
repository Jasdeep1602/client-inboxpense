'use client'; // <-- THIS IS THE MOST IMPORTANT CHANGE

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';

// This is the data structure provided by the analytics page
type CategorySpendingData = {
  month: string;
  categories: { id: string; name: string; color: string; total: number }[];
  monthlyTotal: number;
};

export const CategorySpendingChart = ({
  data,
}: {
  data: CategorySpendingData[];
}) => {
  // --- Aggregate the nested data into a simple format for the chart ---
  const aggregatedData = data
    .flatMap((month) => month.categories)
    .reduce((acc, category) => {
      const existing = acc.find((item) => item.name === category.name);
      if (existing) {
        existing.value += category.total;
      } else {
        acc.push({
          name: category.name,
          value: Number(category.total),
          color: category.color,
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[])
    .sort((a, b) => b.value - a.value);

  // --- Prepare Data & Options for the ApexCharts Radial Bar Chart ---
  const totalSpending = aggregatedData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const series =
    totalSpending > 0
      ? aggregatedData.map((item) =>
          parseFloat(((item.value / totalSpending) * 100).toFixed(2))
        )
      : [];

  const labels = aggregatedData.map((item) => item.name);
  const colors = aggregatedData.map((item) => item.color);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '30%',
        },
        dataLabels: {
          show: false,
        },
        track: {
          background: '#f1f5f9',
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
        colors: '#64748b',
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    stroke: {
      lineCap: 'round',
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex, w }) {
        const categoryName = w.globals.labels[seriesIndex];
        const originalDataPoint = aggregatedData.find(
          (d) => d.name === categoryName
        );
        const amount = originalDataPoint ? originalDataPoint.value : 0;

        return `
          <div class="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
            <span class="font-semibold text-slate-800 dark:text-slate-200">${categoryName}:</span>
            <span class="text-slate-600 dark:text-slate-400 ml-2">₹${amount.toFixed(
              2
            )}</span>
          </div>
        `;
      },
    },
  };

  if (!aggregatedData || aggregatedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center text-muted-foreground text-sm'>
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
          height={300}
        />
      </CardContent>
    </Card>
  );
};
