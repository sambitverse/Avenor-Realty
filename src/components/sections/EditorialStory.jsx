import React from 'react';

export default function EditorialStory() {
  return (
    <section id="editorial-story" className="px-6 md:px-20 py-32 bg-[#f7f3f2]/50 border-t border-[#c4c7c7]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Editorial Narrative */}
        <div className="md:col-span-7 space-y-8">
          <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block">01 / PHILOSOPHY</span>
          <h2 className="font-sans text-4xl sm:text-6xl md:text-7xl font-medium leading-[1.08] tracking-tight text-[#1c1b1b]">
            Timeless <span className="font-editorial-italic italic text-black font-normal">architecture</span> for people who <span class="font-editorial-italic italic text-[#755a24]">appreciate</span> exceptional living.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#444748] font-light max-w-xl leading-relaxed">
            Our philosophy is rooted in the Swiss tradition of precision and functional luxury. We believe that a home is not just a structure, but a curated environment that enhances the human experience through space, light, and materiality.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="bg-black text-white px-8 py-3.5 rounded-full font-mono text-xs font-semibold uppercase tracking-widest hover:bg-[#755a24] transition-colors shadow-md">
              Our Story
            </button>
            <button className="border border-[#c4c7c7] text-[#1c1b1b] px-8 py-3.5 rounded-full font-mono text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              The Process
            </button>
          </div>
        </div>

        {/* Right Rotated Architectural Showcase Image (Exact Stitch Spec) */}
        <div className="md:col-span-5 relative mt-12 md:mt-0">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border border-[#c4c7c7]/30 bg-[#1c1b1b]">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85" 
              alt="Minimalist architectural detail" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Glass Est. Badge (Exact Stitch Spec) */}
          <div className="absolute -bottom-8 -left-8 w-44 h-44 glass rounded-full flex items-center justify-center p-6 text-center shadow-xl border border-white/50 animate-pulse">
            <p className="font-mono text-[11px] leading-tight uppercase tracking-tighter text-[#1c1b1b] font-bold">
              Est. 2012 <br/> Architectural <br/> Innovation
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
