import React from 'react';
import { STATS_METRICS } from '../../data/mockData';

export default function LuxuryStats() {
  return (
    <section className="py-20 bg-[#181818] text-[#F7F5F2] relative overflow-hidden border-y border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              02 / Scale & Benchmarks
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal text-white">
              Luxury Statistics & Global Metrics
            </h2>
          </div>
          <p className="text-xs font-mono text-[#F7F5F2]/60 uppercase tracking-widest max-w-xs">
            Trusted by HNIs, Family Offices, and Global Architectural Aficionados.
          </p>
        </div>

        {/* 6-Grid Counter Box */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS_METRICS.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl bg-[#242424] border border-[#333333] hover:border-[#C9A86A] transition-all duration-300 group flex flex-col justify-between"
              data-cursor-text="METRIC"
            >
              <div>
                <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#C9A86A] group-hover:scale-105 transition-transform block mb-2">
                  {stat.value}
                </span>
                <h4 className="text-sm font-semibold text-[#F7F5F2] mb-1">
                  {stat.label}
                </h4>
              </div>
              <p className="text-[11px] font-light text-[#F7F5F2]/50 mt-4 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
