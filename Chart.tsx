
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { type PerformanceDataPoint } from '../types';

interface ChartProps {
  data: PerformanceDataPoint[];
  color: string;
}

const Chart: React.FC<ChartProps> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id={`color-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 30, 48, 0.8)',
            borderColor: '#475569',
            color: '#cbd5e1',
          }}
          labelStyle={{ color: '#f1f5f9' }}
          itemStyle={{ color: color }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#color-${color.replace('#','')})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
