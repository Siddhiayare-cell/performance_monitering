import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import SettingsModal from './components/SettingsModal';
import ReportGenerator from './components/ReportGenerator';
import { usePerformanceData } from './hooks/usePerformanceData';
import { INITIAL_THRESHOLDS } from './constants';
import { type Thresholds, type Metric } from './types';
import { exportMetricsToCSV } from './services/exportService';
import { ExportIcon } from './components/icons';

const DATA_HISTORY_SIZE = 60; // Keep last 60 data points (e.g., 2 minutes of data at 2s interval)
const DATA_UPDATE_INTERVAL = 2000; // 2 seconds

function App() {
  const { metrics: rawMetrics, latestTimestamp } = usePerformanceData(DATA_HISTORY_SIZE, DATA_UPDATE_INTERVAL);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [thresholds, setThresholds] = useState<Thresholds>(INITIAL_THRESHOLDS);

  const metricsWithAlerts = useMemo((): Metric[] => {
    return rawMetrics.map(metric => {
      const latestValue = metric.data.length > 0 ? metric.data[metric.data.length - 1].value : 0;
      const threshold = thresholds[metric.id];
      return {
        ...metric,
        isAlerting: latestValue > threshold,
      };
    });
  }, [rawMetrics, thresholds]);

  const handleSaveSettings = (newThresholds: Thresholds) => {
    setThresholds(newThresholds);
    setIsSettingsOpen(false);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} latestDataTimestamp={latestTimestamp} />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <MainDashboard metrics={metricsWithAlerts} />
        <ReportGenerator metrics={metricsWithAlerts} thresholds={thresholds} />
        <div className="mt-6 text-center">
            <button
                onClick={() => exportMetricsToCSV(metricsWithAlerts)}
                className="bg-slate-700 text-slate-300 px-4 py-2 rounded-md hover:bg-slate-600 hover:text-white transition-colors flex items-center gap-2 mx-auto"
            >
                <ExportIcon className="w-5 h-5" />
                Export Data to CSV
            </button>
        </div>
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        thresholds={thresholds}
      />
    </div>
  );
}

export default App;
