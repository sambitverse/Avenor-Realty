import React, { useEffect, useState } from 'react';

export default function CinematicLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => onComplete(), 600);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-[#181818] text-[#F7F5F2] flex flex-col justify-between p-8 md:p-16 transition-opacity duration-700 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Top Header */}
      <div className="flex justify-between items-center text-xs font-mono tracking-widest text-[#C9A86A] uppercase">
        <span>Avenor Architectural Media</span>
        <span>Est. 2026</span>
      </div>

      {/* Center Architectural Blueprint Monogram */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-8">
          <svg className="w-full h-full stroke-[#C9A86A] fill-none" viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            <path d="M20 80 L50 20 L80 80 H60 L50 45 L40 80 Z" strokeWidth="1.5" className="transition-all duration-300" />
            <line x1="50" y1="20" x2="50" y2="90" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-[#F7F5F2] font-normal mb-2">
          AVENOR
        </h1>
        <p className="text-xs font-mono tracking-widest text-[#F7F5F2]/60 uppercase">
          Curating Modern Architectural Landmarks
        </p>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="w-full max-w-xl mx-auto">
        <div className="flex justify-between items-end mb-3 text-xs font-mono tracking-widest">
          <span className="text-[#C9A86A]">INITIALIZING SCROLL WORLD</span>
          <span className="text-xl text-[#F7F5F2] font-semibold">{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-[#F7F5F2]/10 relative overflow-hidden">
          <div 
            className="h-full bg-[#C9A86A] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
