import React from 'react';
import { useApp } from '../../context/AppContext';

export default function SmartSearch() {
  const { filters, setFilters } = useApp();

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="smart-search" className="px-6 md:px-20 py-24 bg-[#fdf8f8]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Floating Glass Search Panel (Exact Stitch Spec) */}
        <div className="md:w-1/3 glass p-8 sm:p-10 rounded-2xl border border-[#c4c7c7]/30 flex flex-col gap-6 shadow-lg bg-white/70">
          <h3 className="font-sans text-2xl font-bold tracking-tight text-[#1c1b1b]">
            Find your sanctuary.
          </h3>
          
          <div className="space-y-5">
            <div className="border-b border-[#c4c7c7]/50 pb-3">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#858383] block mb-1">
                Destination
              </label>
              <input 
                type="text" 
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
                placeholder="Where do you want to live?" 
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-[#1c1b1b] placeholder-[#1c1b1b]/40 focus:outline-none font-sans"
              />
            </div>

            <div className="border-b border-[#c4c7c7]/50 pb-3">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#858383] block mb-1">
                Property Category
              </label>
              <select 
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-[#1c1b1b] appearance-none cursor-pointer focus:outline-none font-sans"
              >
                <option value="All">All Categories</option>
                <option value="Luxury Villas">Luxury Eco-Villa</option>
                <option value="Penthouses">Urban Penthouse</option>
                <option value="Sky Apartments">Sky Apartment</option>
                <option value="Farm Houses">Farm House</option>
                <option value="Commercial">Commercial Tower</option>
              </select>
            </div>

            <div className="border-b border-[#c4c7c7]/50 pb-3">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#858383] block mb-1">
                Purpose
              </label>
              <select 
                value={filters.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-[#1c1b1b] appearance-none cursor-pointer focus:outline-none font-sans"
              >
                <option value="All">Buy or Rent</option>
                <option value="Buy">Buy Estate</option>
                <option value="Rent">Lease Penthouse</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => {
              const el = document.getElementById('featured-properties');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-black text-white py-4 rounded-full font-mono text-xs font-semibold uppercase tracking-widest hover:bg-[#755a24] transition-all hover:scale-[1.02] active:scale-95 shadow-md"
          >
            Explore Catalog
          </button>
        </div>

        {/* Stats Grid (Exact Stitch Spec) */}
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center px-4 sm:px-12 py-6">
          <div className="stat-item border-b sm:border-b-0 border-[#c4c7c7]/30 pb-6 sm:pb-0">
            <h2 className="font-sans text-6xl sm:text-7xl font-bold leading-none mb-2 text-black">
              2,500+
            </h2>
            <p className="font-mono text-xs font-semibold text-[#858383] uppercase tracking-widest">
              Properties Managed
            </p>
          </div>

          <div className="stat-item border-b sm:border-b-0 border-[#c4c7c7]/30 pb-6 sm:pb-0">
            <h2 className="font-sans text-6xl sm:text-7xl font-bold leading-none mb-2 text-black">
              98%
            </h2>
            <p className="font-mono text-xs font-semibold text-[#858383] uppercase tracking-widest">
              Satisfaction Rate %
            </p>
          </div>

          <div className="stat-item">
            <h2 className="font-sans text-6xl sm:text-7xl font-bold leading-none mb-2 text-black">
              18+
            </h2>
            <p className="font-mono text-xs font-semibold text-[#858383] uppercase tracking-widest">
              Cities Worldwide
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
