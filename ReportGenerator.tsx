import React, { useState } from 'react';
import { generatePerformanceReport } from '../services/geminiService';
import { type Metric, type Thresholds } from '../types';
import { AlertIcon, CheckCircleIcon, InfoIcon, LightbulbIcon } from './icons';

interface ReportGeneratorProps {
  metrics: Metric[];
  thresholds: Thresholds;
}

interface ReportData {
  title: string;
  executiveSummary: string;
  alerts: {
    metricName: string;
    peakValue: number;
    threshold: number;
    timestamp: string;
  }[];
  recommendations: string[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ metrics, thresholds }) => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const jsonString = await generatePerformanceReport(metrics, thresholds);
      const parsedReport: ReportData = JSON.parse(jsonString);
      setReport(parsedReport);
    } catch (err) {
      console.error("Failed to generate or parse report:", err);
      setError('Failed to generate or parse the performance report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-lg shadow-lg p-4 md:p-6 mt-4 md:mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-slate-100 mb-2 sm:mb-0">AI Performance Analysis</h2>
        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <LightbulbIcon className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-md flex items-center gap-2">
            <AlertIcon className="w-5 h-5" />
            <p>{error}</p>
        </div>
      )}

      {!isLoading && !report && !error && (
        <div className="bg-slate-800 border border-slate-700/50 p-4 rounded-md flex items-center gap-3">
          <InfoIcon className="w-6 h-6 text-cyan-400" />
          <p className="text-slate-400">Click "Generate Report" to get an AI-powered analysis of the current system performance.</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-300 mt-4">Analyzing performance data...</p>
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-2xl font-semibold text-cyan-400">{report.title}</h3>
          <p className="text-slate-300">{report.executiveSummary}</p>

          {report.alerts.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <AlertIcon className="w-5 h-5 text-red-500" />
                Active Alerts
              </h4>
              <ul className="list-none space-y-2 pl-2">
                {report.alerts.map((alert, index) => (
                  <li key={index} className="bg-red-900/30 p-3 rounded-md border border-red-500/30 text-red-200">
                    <strong>{alert.metricName}:</strong> Reached peak of <strong>{alert.peakValue.toFixed(2)}</strong>, exceeding threshold of {alert.threshold}.
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                Recommendations
            </h4>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
