'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

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
  const chartData = data.map((item) => ({
    name: formatMonth(item.month),
    Credit: item.totalCredit,
    Debit: item.totalDebit,
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div className='h-[300px] flex items-center justify-center text-muted-foreground text-sm'>
        No monthly data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis
          dataKey='name'
          stroke='hsl(var(--muted-foreground))'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='hsl(var(--muted-foreground))'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${Number(value) / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          formatter={(value: number) => `₹${value.toFixed(2)}`}
        />
        <Legend iconType='circle' />
        <Bar dataKey='Credit' fill='#22c55e' radius={[4, 4, 0, 0]} />
        <Bar dataKey='Debit' fill='#ef4444' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
