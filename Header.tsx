import React, { useState, useEffect } from 'react';
import { SettingsIcon } from './icons';

interface HeaderProps {
  onOpenSettings: () => void;
  latestDataTimestamp: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, latestDataTimestamp }) => {
  const [displayTime, setDisplayTime] = useState(new Date(latestDataTimestamp));

  useEffect(() => {
    // Re-synchronize the clock whenever a new data timestamp arrives from the stream.
    // This corrects any potential drift.
    setDisplayTime(new Date(latestDataTimestamp));
  }, [latestDataTimestamp]);

  useEffect(() => {
    // This timer ticks the clock forward every second, independent of data updates.
    // It runs only once to set up the ticking mechanism.
    const timerId = setInterval(() => {
      setDisplayTime(prevTime => new Date(prevTime.getTime() + 1000));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="bg-slate-800/50 border-b border-slate-700 shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          System Performance Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-lg font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
            {formatTime(displayTime)}
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
