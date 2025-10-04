import React from 'react';

export interface PerformanceDataPoint {
  time: number;
  value: number;
}

export type MetricId = 'cpu' | 'memory' | 'disk' | 'network';

export interface Metric {
  id: MetricId;
  name: string;
  unit: string;
  color: string;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  data: PerformanceDataPoint[];
  isAlerting?: boolean;
}

export type Thresholds = Record<MetricId, number>;
