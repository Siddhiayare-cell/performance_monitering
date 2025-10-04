import { useState, useEffect } from 'react';
import { getInitialData, startDataStream, stopDataStream } from '../services/performanceService';
import { type Metric, type MetricId, type PerformanceDataPoint } from '../types';

// Define the shape of the data payload from our custom event
type MetricUpdatePayload = Record<MetricId, PerformanceDataPoint>;

export const usePerformanceData = (historySize: number, updateInterval: number): { metrics: Metric[], latestTimestamp: number } => {
  // Generate initial data just once to avoid re-running the logic on every render.
  const [initialData] = useState(() => {
    const initialMetrics = getInitialData(historySize);
    let initialTimestamp = Date.now();
    if (initialMetrics.length > 0 && initialMetrics[0].data.length > 0) {
        initialTimestamp = initialMetrics[0].data[initialMetrics[0].data.length - 1].time;
    }
    return { initialMetrics, initialTimestamp };
  });

  const [metrics, setMetrics] = useState<Metric[]>(initialData.initialMetrics);
  const [latestTimestamp, setLatestTimestamp] = useState<number>(initialData.initialTimestamp);


  useEffect(() => {
    // This handler will be called whenever our 'metric-update' event is dispatched
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<MetricUpdatePayload>;
      const newPoints = customEvent.detail;
      
      // All points in a single update share the same timestamp.
      const newTimestamp = newPoints.cpu.time;
      setLatestTimestamp(newTimestamp);

      setMetrics(prevMetrics => {
        return prevMetrics.map(metric => {
          const newDataPoint = newPoints[metric.id];
          if (!newDataPoint) {
            return metric; // Return unchanged if no new data for this metric
          }

          // Append the new data point
          const newData = [...metric.data, newDataPoint];
          
          // Ensure the data history does not exceed the specified size
          if (newData.length > historySize) {
            newData.shift(); // Remove the oldest data point
          }
          
          return { ...metric, data: newData };
        });
      });
    };

    // Subscribe to the custom event when the component mounts
    window.addEventListener('metric-update', handleUpdate);
    // Start the data stream (our simulated WebSocket/SSE)
    startDataStream(updateInterval);

    // Cleanup function: remove listener and stop the stream when the component unmounts
    return () => {
      window.removeEventListener('metric-update', handleUpdate);
      stopDataStream();
    };
  }, [historySize, updateInterval]);

  return { metrics, latestTimestamp };
};
