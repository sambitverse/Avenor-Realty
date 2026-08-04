import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, Bookmark, Layers, Eye } from 'lucide-react';

export default function FeaturedProperties() {
  const { properties, openPropertyDetail, open360Tour, toggleBookmark, toggleCompare, bookmarks, compareList } = useApp();

  const mainProp = properties[0];
  const secondaryProp1 = properties[1] || properties[0];
  const secondaryProp2 = properties[2] || properties[0];

  return (
    <section id="featured-properties" className="px-6 md:px-20 py-24 bg-[#fdf8f8]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block mb-3">Portfolio</span>
            <h2 className="font-sans text-4xl sm:text-5xl font-medium tracking-tight text-[#1c1b1b]">Featured Projects</h2>
          </div>
          
          <div className="hidden sm:flex gap-3">
            <button 
              onClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-full border border-[#c4c7c7] text-xs font-mono uppercase tracking-wider hover:bg-black hover:text-white transition-all"
            >
              View Typologies
            </button>
          </div>
        </div>

        {/* Bento Grid (Exact Stitch Spec) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[750px]">
          
          {/* Large Hero Project Card (md:col-span-8) */}
          <div 
            onClick={() => openPropertyDetail(mainProp)}
            className="md:col-span-8 relative group rounded-2xl overflow-hidden shadow-2xl cursor-pointer bg-[#1c1b1b]"
          >
            <img 
              src={mainProp.images[0]} 
              alt={mainProp.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500" />
            
            {/* Top Quick Badges */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-widest border border-white/20">
                {mainProp.category} • ₹{(mainProp.price / 10000000).toFixed(2)} Cr
              </span>

              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => open360Tour(mainProp)} 
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#755a24] transition-colors"
                  title="360° Studio"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toggleCompare(mainProp)} 
                  className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                    compareList.includes(mainProp.id) ? 'bg-[#755a24] text-white' : 'bg-black/60 text-white hover:bg-white hover:text-black'
                  }`}
                  title="Compare"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h3 className="font-sans text-3xl sm:text-4xl font-medium mb-2 group-hover:text-[#755a24] transition-colors">
                {mainProp.title}
              </h3>
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">
                {mainProp.location} • {mainProp.area} sqft
              </p>
            </div>
          </div>

          {/* Small Card Stack (md:col-span-4) */}
          <div className="md:col-span-4 flex flex-col gap-8">
            
            {/* Card 2 */}
            <div 
              onClick={() => openPropertyDetail(secondaryProp1)}
              className="h-1/2 relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-[#1c1b1b]"
            >
              <img 
                src={secondaryProp1.images[0]} 
                alt={secondaryProp1.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="font-sans text-2xl font-medium">{secondaryProp1.title}</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-80 mt-1">
                  {secondaryProp1.location} • ₹{(secondaryProp1.price / 10000000).toFixed(2)} Cr
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => openPropertyDetail(secondaryProp2)}
              className="h-1/2 relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-[#1c1b1b]"
            >
              <img 
                src={secondaryProp2.images[0]} 
                alt={secondaryProp2.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="font-sans text-2xl font-medium">{secondaryProp2.title}</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-80 mt-1">
                  {secondaryProp2.location} • ₹{(secondaryProp2.price / 10000000).toFixed(2)} Cr
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
