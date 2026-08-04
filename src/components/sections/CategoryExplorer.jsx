import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryExplorer() {
  const { setFilters } = useApp();

  const handleSelectCategory = (catName) => {
    setFilters(prev => ({ ...prev, category: catName }));
    const el = document.getElementById('featured-properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="py-24 bg-[#181818] text-[#F7F5F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              05 / Architectural Categories
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white tracking-tight">
              Explore by Typology
            </h2>
          </div>
          <p className="text-xs font-mono text-[#F7F5F2]/60 uppercase tracking-widest max-w-sm">
            Discover bespoke living spaces tailored to your architectural style.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleSelectCategory(cat.name)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer border border-[#333333] hover:border-[#C9A86A] transition-all duration-500 shadow-xl"
              data-cursor-text="SELECT"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                <div>
                  <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-white group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-[#C9A86A] group-hover:text-[#181818] text-white flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
