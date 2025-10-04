import { INITIAL_METRICS } from '../constants';
import { type Metric, type MetricId, type PerformanceDataPoint } from '../types';

let intervalId: number | null = null;
const lastValues: Record<MetricId, number | null> = {
    cpu: null,
    memory: null,
    disk: null,
    network: null,
};

const generateRandomValue = (id: MetricId, lastValue: number | null): number => {
  const randomFactor = (Math.random() - 0.5);
  switch (id) {
    case 'cpu':
      const baseCpu = lastValue ?? 30;
      return Math.max(0, Math.min(100, baseCpu + randomFactor * 10));
    case 'memory':
      const baseMem = lastValue ?? 8.5; // Assuming 16GB total
      return Math.max(0, Math.min(16, baseMem + randomFactor * 0.5));
    case 'disk':
      // Disk and Network can be more spiky
      return Math.max(0, Math.random() * 150);
    case 'network':
       return Math.max(0, Math.random() * 100);
    default:
      return 0;
  }
};

const generateAllMetrics = (): Record<MetricId, PerformanceDataPoint> => {
    const newTime = Date.now();
    const newPoints = {
        cpu: { time: newTime, value: generateRandomValue('cpu', lastValues.cpu) },
        memory: { time: newTime, value: generateRandomValue('memory', lastValues.memory) },
        disk: { time: newTime, value: generateRandomValue('disk', lastValues.disk) },
        network: { time: newTime, value: generateRandomValue('network', lastValues.network) }
    };

    // Update last known values for smoother transitions for stateful metrics
    lastValues.cpu = newPoints.cpu.value;
    lastValues.memory = newPoints.memory.value;

    return newPoints;
};

export const startDataStream = (updateInterval: number) => {
    if (intervalId) {
        return; // Stream already running
    }
    intervalId = window.setInterval(() => {
        const newMetricData = generateAllMetrics();
        // Dispatch a custom event that the UI can listen to.
        // This simulates a push from a WebSocket or SSE.
        const event = new CustomEvent('metric-update', { detail: newMetricData });
        window.dispatchEvent(event);
    }, updateInterval);
};

export const stopDataStream = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

export const getInitialData = (historySize: number): Metric[] => {
  return INITIAL_METRICS.map(metricInfo => {
    const data: PerformanceDataPoint[] = [];
    let currentLastValue: number | null = null;
    const now = Date.now();
    for (let i = 0; i < historySize; i++) {
        const value = generateRandomValue(metricInfo.id, currentLastValue);
        data.push({
            // Use the same interval as the stream for consistent time gaps
            time: now - (historySize - i) * 2000,
            value,
        });
        currentLastValue = value;
    }
    // Set the initial "last value" so the stream can continue smoothly
    lastValues[metricInfo.id] = currentLastValue;
    return { ...metricInfo, data };
  });
};
