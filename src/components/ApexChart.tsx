/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

// ApexCharts needs the 'window' object, so we must load it dynamically on the client side.
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// This is our simple, reusable wrapper.
const ApexChart = ({
  options,
  series,
  type,
  height,
}: {
  options: ApexOptions;
  series: ApexOptions['series'];
  type: string;
  height: number;
}) => {
  return (
    <Chart
      options={options}
      series={series}
      type={type as any}
      height={height}
      width='100%'
    />
  );
};

export default ApexChart;
