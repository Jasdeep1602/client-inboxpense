/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';

// This is the correct, complex type that the API sends.
type CategorySpendingData = {
  month: string;
  categories: {
    id: string;
    name: string;
    color: string;
    total: number;
  }[];
  monthlyTotal: number;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='p-2 text-sm bg-background border rounded-lg shadow-lg'>
        <p className='font-semibold'>{`${
          payload[0].name
        }: ₹${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export const CategorySpendingChart = ({
  data,
}: {
  data: CategorySpendingData[];
}) => {
  console.log('data', data);
  // --- THIS IS THE FIX ---
  // We correctly aggregate the nested data on the client to prepare it for the pie chart.
  const aggregatedData = data
    .flatMap((month) => month.categories) // 1. Flatten the array of months into a single array of all categories
    .reduce((acc, category) => {
      // 2. Sum up the totals for each unique category name
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
    .sort((a, b) => b.value - a.value); // Sort by highest spending
  // --- END FIX ---

  if (!aggregatedData || aggregatedData.length === 0) {
    return (
      <div className='h-[300px] flex items-center justify-center text-muted-foreground text-sm'>
        No categorized spending to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={aggregatedData}
          cx='50%'
          cy='50%'
          labelLine={false}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          fill='#8884d8'
          dataKey='value'
          nameKey='name'>
          {aggregatedData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          iconType='circle'
          layout='vertical'
          verticalAlign='middle'
          align='right'
          formatter={(value) => (
            <span className='text-muted-foreground'>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
