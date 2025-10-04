import { type Metric } from '../types';

type PivotedData = {
    [timestamp: number]: {
        [metricId: string]: number;
    };
};

export const exportMetricsToCSV = (metrics: Metric[]) => {
    if (!metrics || metrics.length === 0 || metrics.every(m => m.data.length === 0)) {
        console.warn("No data available to export.");
        return;
    }

    const pivotedData: PivotedData = {};
    metrics.forEach(metric => {
        metric.data.forEach(dataPoint => {
            if (!pivotedData[dataPoint.time]) {
                pivotedData[dataPoint.time] = {};
            }
            pivotedData[dataPoint.time][metric.id] = dataPoint.value;
        });
    });

    const sortedTimestamps = Object.keys(pivotedData).map(Number).sort((a, b) => a - b);

    const headers = ['Time', ...metrics.map(m => `${m.name} (${m.unit})`)];
    let csvContent = headers.join(',') + '\n';

    sortedTimestamps.forEach(timestamp => {
        const date = new Date(timestamp);
        const formattedTime = date.toLocaleString();
        
        const rowData = metrics.map(metric => {
            const value = pivotedData[timestamp][metric.id];
            return value !== undefined ? value.toFixed(2) : '';
        });

        // Enclose time in quotes to handle commas in some locales
        const row = [`"${formattedTime}"`, ...rowData].join(',');
        csvContent += row + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'performance-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};