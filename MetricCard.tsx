import React from 'react';
import { type Metric } from '../types';
import Chart from './Chart';
import { AlertIcon } from './icons';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const latestValue = metric.data.length > 0 ? metric.data[metric.data.length - 1].value : 0;
  const Icon = metric.icon;

  const cardClasses = `bg-slate-800/70 border rounded-lg shadow-lg p-4 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
    metric.isAlerting
      ? 'border-red-500/80 shadow-red-500/20'
      : 'border-slate-700 hover:border-slate-500'
  }`;

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
            {metric.isAlerting && <AlertIcon className="w-5 h-5 text-red-500" aria-label="Alert" />}
            <h2 className="text-lg font-semibold text-slate-300">{metric.name}</h2>
        </div>
        <Icon className="w-6 h-6" style={{ color: metric.color }} />
      </div>
      <div className="flex items-baseline space-x-2">
        <p className="text-4xl font-bold text-slate-100">
          {latestValue.toFixed(metric.id === 'memory' ? 2 : 1)}
        </p>
        <span className="text-slate-400">{metric.unit}</span>
      </div>
      <div className="flex-grow h-24 mt-4">
        <Chart data={metric.data} color={metric.isAlerting ? '#ef4444' : metric.color} />
      </div>
    </div>
  );
};

export default MetricCard;
