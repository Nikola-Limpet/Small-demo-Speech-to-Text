'use client';

import React from 'react';

interface VisualizerProps {
  volume: number; // 0 to 1
  isActive: boolean;
  isConnecting: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ volume, isActive, isConnecting }) => {
  // Determine Text State
  let text = '';
  if (isConnecting) {
      text = 'INITIALIZING...';
  } else if (isActive) {
      if (volume > 0.02) {
          text = 'SPEAKING';
      } else {
          text = 'LISTENING';
      }
  }

  // Dynamic Scale for the blob based on volume
  // Base scale is 1, max is around 1.5 when loud
  const scale = isActive ? 1 + (Math.min(volume, 1) * 0.6) : 0.8;

  return (
    <div className="flex items-center gap-4 min-w-[140px]">
      {/* Liquid Blob Container */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Glow/Blur Layer */}
        {(isActive || isConnecting) && (
            <div 
                className="absolute inset-0 bg-white/40 blur-xl rounded-full transition-all duration-100 ease-out"
                style={{
                    transform: `scale(${scale * 1.5})`,
                    opacity: isConnecting ? 0.5 : 0.3 + (volume * 0.5)
                }}
            />
        )}
        
        {/* Main Solid Blob */}
        <div 
            className={`w-8 h-8 bg-white transition-all duration-75 ease-out shadow-[0_0_15px_rgba(255,255,255,0.3)] ${
                isConnecting ? 'animate-spin' : 'animate-liquid'
            }`}
            style={{
                transform: `scale(${isConnecting ? 0.8 : scale})`,
                // If connecting, we use a simple shape, if active we use the morphing class
                borderRadius: isConnecting ? '40% 60% 60% 40% / 60% 30% 70% 40%' : undefined
            }}
        />
      </div>

      {/* Status Text */}
      <div className="flex flex-col justify-center h-10 overflow-hidden">
          <span className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-all duration-300 ${
              isActive ? 'text-white' : 'text-zinc-500'
          }`}>
              {text}
          </span>
          {/* Animated Dots/Lines for extra visual feedback when processing */}
          {isActive && (
              <div className="flex gap-0.5 mt-1 h-0.5">
                  <div className="w-1 bg-white/50 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 bg-white/50 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 bg-white/50 animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
          )}
      </div>
    </div>
  );
};