'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ApexChart from './ApexChart';
import { ApexOptions } from 'apexcharts';

type AggregatedCategoryData = {
  name: string;
  value: number;
  color: string;
};

type CategorySpendingData = {
  month: string;
  categories: { name: string; color: string; total: number }[];
  monthlyTotal: number;
};

export const CategorySpendingChart = ({
  data,
  onCategorySelect,
}: {
  data: CategorySpendingData[];
  onCategorySelect: (data: AggregatedCategoryData) => void;
}) => {
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
    }, [] as AggregatedCategoryData[])
    .sort((a, b) => b.value - a.value);

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
      height: 350,
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedIndex = config.dataPointIndex;
          onCategorySelect(aggregatedData[selectedIndex]);
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
          background: '#f1f5f9',
        },
      },
    },
    colors: colors,
    labels: labels,
    // --- THIS IS THE FIX ---
    // Restore the legend configuration
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
    // --- END FIX ---
    stroke: {
      lineCap: 'round',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val, { seriesIndex }) => {
          const originalDataPoint = aggregatedData[seriesIndex];
          const amount = originalDataPoint ? originalDataPoint.value : 0;
          return `₹${amount.toFixed(2)}`;
        },
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
