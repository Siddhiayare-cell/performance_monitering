import React, { useState, useEffect } from 'react';
import { type Thresholds, type MetricId } from '../types';
import { INITIAL_METRICS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newThresholds: Thresholds) => void;
  thresholds: Thresholds;
}

const metricLabels: Record<MetricId, string> = {
    cpu: 'CPU Usage Threshold (%)',
    memory: 'Memory Usage Threshold (GB)',
    disk: 'Disk I/O Threshold (MB/s)',
    network: 'Network Traffic Threshold (Mbps)',
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, thresholds }) => {
  const [localThresholds, setLocalThresholds] = useState<Thresholds>(thresholds);

  useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(localThresholds);
  };

  const handleChange = (id: MetricId, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
        setLocalThresholds(prev => ({ ...prev, [id]: numValue }));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-slate-800 rounded-lg shadow-2xl max-w-md w-full flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-700">
          <h2 id="settings-title" className="text-xl font-bold text-slate-100">Performance Thresholds</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl" aria-label="Close settings">&times;</button>
        </div>
        <div className="p-6 space-y-4">
            {INITIAL_METRICS.map(({ id, unit }) => (
                <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{metricLabels[id]}</label>
                    <div className="relative">
                        <input
                            type="number"
                            id={id}
                            value={localThresholds[id]}
                            onChange={(e) => handleChange(id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-slate-400">{unit}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-4 flex justify-end items-center gap-4 border-t border-slate-700">
            <button
                onClick={onClose}
                className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
            >
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
