
import React from 'react';
import MetricCard from './MetricCard';
import { type Metric } from '../types';

interface MainDashboardProps {
  metrics: Metric[];
}

const MainDashboard: React.FC<MainDashboardProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};

export default MainDashboard;
