import React from 'react';
import { type Metric, type Thresholds } from './types';
import { CpuIcon, MemoryIcon, DiskIcon, NetworkIcon } from './components/icons';

export const INITIAL_METRICS: Omit<Metric, 'data'>[] = [
  {
    id: 'cpu',
    name: 'CPU Usage',
    unit: '%',
    color: '#38bdf8', // cyan-400
    icon: CpuIcon,
  },
  {
    id: 'memory',
    name: 'Memory Usage',
    unit: 'GB',
    color: '#34d399', // emerald-400
    icon: MemoryIcon,
  },
  {
    id: 'disk',
    name: 'Disk I/O',
    unit: 'MB/s',
    color: '#fcd34d', // amber-300
    icon: DiskIcon,
  },
  {
    id: 'network',
    name: 'Network Traffic',
    unit: 'Mbps',
    color: '#f472b6', // pink-400
    icon: NetworkIcon,
  },
];

export const INITIAL_THRESHOLDS: Thresholds = {
    cpu: 80, // %
    memory: 14, // GB (assuming 16GB total)
    disk: 120, // MB/s
    network: 80, // Mbps
};
