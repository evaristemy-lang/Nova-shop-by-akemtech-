import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-8 px-6 bg-slate-950/90 text-slate-300 text-xs font-semibold flex items-center justify-between z-40 select-none border-b border-slate-900/60">
      <span className="font-mono tracking-tight text-[11px] text-white font-bold">{time || '14:30'}</span>
      <div className="flex items-center gap-2 text-slate-300">
        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded">5G</span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
  );
};
