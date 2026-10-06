import React, { ReactNode } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';

export const DeviceFrameWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl min-h-screen flex flex-col bg-slate-950 border-x border-slate-900 shadow-2xl relative">
        {/* Android Native Status Bar */}
        <AndroidStatusBar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-slate-950">
          {children}
        </div>
      </div>
    </div>
  );
};
