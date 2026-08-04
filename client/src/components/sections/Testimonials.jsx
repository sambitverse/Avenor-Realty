import React from 'react';
import { TESTIMONIALS } from '../../data/mockData';

export default function Testimonials() {
  const t = TESTIMONIALS[0];

  return (
    <section className="px-6 md:px-20 py-32 bg-[#f1edec] overflow-hidden relative border-t border-[#c4c7c7]/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Giant Background Watermark (Exact Stitch Spec) */}
        <h2 className="text-huge font-bold text-black/5 select-none pointer-events-none mb-[-50px] uppercase tracking-tight">
          VOICES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center relative z-10">
          
          {/* Quote Content */}
          <div>
            <div className="flex gap-1 mb-6 text-[#755a24]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>

            <p className="font-sans text-2xl sm:text-4xl font-medium leading-tight text-[#1c1b1b] mb-10">
              "{t.quote}"
            </p>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black">
                <img 
                  src={t.avatar} 
                  alt={t.author} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-lg text-black">{t.author}</p>
                <p className="font-mono text-xs text-[#858383] uppercase tracking-widest">{t.title}</p>
              </div>
            </div>
          </div>

          {/* Architectural Texture Grid (Exact Stitch Spec) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#e5e2e1] shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" 
                alt="Architectural texture study" 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-[#e5e2e1] shadow-md translate-y-8">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" 
                alt="Architectural model study" 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
