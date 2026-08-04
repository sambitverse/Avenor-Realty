import React from 'react';
import { PROJECTS_TIMELINE } from '../../data/mockData';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function ProjectsTimeline() {
  return (
    <section id="projects-timeline" className="py-24 bg-[#181818] text-[#F7F5F2] relative border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              11 / Construction Roadmap
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white tracking-tight">
              Latest Projects & Developments
            </h2>
          </div>
          <p className="text-xs font-mono text-[#F7F5F2]/60 uppercase tracking-widest max-w-sm">
            Track real-time construction milestones and upcoming architectural launches.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-[1px] before:bg-[#333333]">
          {PROJECTS_TIMELINE.map((item, idx) => (
            <div 
              key={idx}
              className={`relative flex flex-col md:flex-row items-start ${
                idx % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Node */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#181818] border-2 border-[#C9A86A] flex items-center justify-center text-[#C9A86A] z-10">
                <Clock className="w-3.5 h-3.5" />
              </div>

              {/* Content Box */}
              <div className="ml-12 md:ml-0 md:w-1/2 px-0 md:px-12 w-full">
                <div className="p-8 rounded-3xl bg-[#242424] border border-[#333333] hover:border-[#C9A86A] transition-all duration-300 shadow-xl group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-[#C9A86A] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      {item.phase}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-white mb-2 group-hover:text-[#C9A86A] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-light text-[#F7F5F2]/70 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#F7F5F2]/60 uppercase tracking-widest">
                      <span>Completion Milestone</span>
                      <span className="text-[#C9A86A] font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#181818] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A86A] rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#333333] flex items-center justify-between text-xs font-mono text-[#F7F5F2]/40">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#C9A86A]" /> {item.location}</span>
                    <span>AVENOR DEVELOPMENT</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
