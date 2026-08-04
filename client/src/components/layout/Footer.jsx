import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { setActiveTab } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f7f3f2] w-full py-28 px-6 md:px-20 border-t border-[#c4c7c7]/20 relative overflow-hidden text-[#1c1b1b]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start relative z-10">
        
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="font-sans text-3xl sm:text-4xl font-bold tracking-tighter text-black mb-4">
            Avenor
          </div>
          <p className="font-sans text-xs text-[#858383] max-w-xs mb-6 leading-relaxed font-light">
            Dedicated to showcasing and advancing modern architectural innovations and practices.
          </p>
          <button 
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-black text-white px-8 py-3 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[#755a24] transition-all shadow-sm"
          >
            Say hi to us!
          </button>
        </div>

        {/* Navigation Column */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <h5 className="font-bold tracking-widest text-black uppercase mb-1">Navigation</h5>
          <button onClick={() => setActiveTab('main')} className="text-left text-[#858383] hover:text-black transition-colors">Home</button>
          <button onClick={() => setActiveTab('main')} className="text-left text-[#858383] hover:text-black transition-colors">Properties</button>
          <button onClick={() => setActiveTab('main')} className="text-left text-[#858383] hover:text-black transition-colors">Projects</button>
          <button onClick={() => setActiveTab('main')} className="text-left text-[#858383] hover:text-black transition-colors">Journal</button>
        </div>

        {/* Products Column */}
        <div className="flex flex-col gap-3 font-mono text-xs">
          <h5 className="font-bold tracking-widest text-black uppercase mb-1">Portals</h5>
          <button onClick={() => setActiveTab('dashboard')} className="text-left text-[#858383] hover:text-[#755a24] transition-colors">User Dashboard</button>
          <button onClick={() => setActiveTab('admin')} className="text-left text-[#858383] hover:text-black transition-colors">Admin Control Suite</button>
          <a href="#" className="text-[#858383] hover:text-black transition-colors">Eco-villa Pavilion</a>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-2 font-mono text-xs">
          <h5 className="font-bold tracking-widest text-black uppercase mb-1">Contact</h5>
          <p className="text-[#858383]">hello@avenor.com</p>
          <p className="text-[#858383]">+91 98200 11223</p>
          <p className="text-[#858383] mt-2 leading-relaxed">
            Ideas District, Architectural City<br/>Mumbai • Dubai • Singapore
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-[#c4c7c7]/20 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#858383] font-mono uppercase tracking-widest relative z-10 gap-4">
        <p>© 2026 Avenor Architectural Excellence. All rights reserved.</p>
        <div className="flex gap-8">
          <a className="hover:text-black" href="#">Privacy Policy</a>
          <a className="hover:text-black" href="#">Terms of Service</a>
          <a className="hover:text-black" href="#">Instagram</a>
          <a className="hover:text-black" href="#">LinkedIn</a>
        </div>
      </div>

      {/* Huge Background Watermark (Exact Stitch Spec) */}
      <div className="font-sans font-bold opacity-5 absolute -bottom-10 left-0 pointer-events-none text-[25vw] leading-none uppercase text-black select-none">
        AVENOR
      </div>

      {/* Back to Top Arrow */}
      <button 
        onClick={scrollToTop}
        className="absolute bottom-10 right-8 md:right-20 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 hover:bg-[#755a24] transition-all shadow-xl z-20"
        title="Back to top"
      >
        <span className="material-symbols-outlined text-xl">arrow_upward</span>
      </button>

    </footer>
  );
}
