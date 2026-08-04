import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, SlidersHorizontal, Eye, Layers, Bookmark, ArrowUpRight, X, Check, RefreshCw, Clock, Tag } from 'lucide-react';
import { formatPropertyPrice, COUNTRY_CURRENCIES } from '../utils/currencyHelper';

export default function PropertiesPage() {
  const { properties, openPropertyDetail, open360Tour, toggleCompare, toggleBookmark, compareList, bookmarks, user } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All'); // 'All' | 'Buy' | 'Rent'
  const [selectedAvailability, setSelectedAvailability] = useState('All'); // 'All' | 'Ready to Move' | 'Off-Plan' | 'Reserved'
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('All');
  
  // Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const userCountry = user?.preferredCountry || 'India';

  const filteredProperties = properties.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || p.country.toLowerCase() === selectedCountry.toLowerCase();
    
    const matchesPurpose = selectedPurpose === 'All' || (p.purpose && p.purpose.toLowerCase() === selectedPurpose.toLowerCase());

    let matchesAvailability = true;
    if (selectedAvailability !== 'All') {
      const poss = p.possession ? p.possession.toLowerCase() : '';
      if (selectedAvailability === 'Ready to Move') matchesAvailability = poss.includes('ready');
      else if (selectedAvailability === 'Off-Plan') matchesAvailability = poss.includes('off-plan') || poss.includes('under construction');
      else if (selectedAvailability === 'Reserved') matchesAvailability = poss.includes('reserved') || poss.includes('sold');
    }
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(q) || 
      p.location.toLowerCase().includes(q) || 
      p.city.toLowerCase().includes(q) || 
      p.country.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q);

    let matchesBudget = true;
    if (budgetFilter === '30M') matchesBudget = p.price <= 30000000;
    else if (budgetFilter === '50M') matchesBudget = p.price > 30000000 && p.price <= 50000000;
    else if (budgetFilter === '50M+') matchesBudget = p.price > 50000000;

    return matchesCat && matchesCountry && matchesPurpose && matchesAvailability && matchesSearch && matchesBudget;
  });

  const countries = ['All', 'India', 'UAE', 'USA', 'Japan', 'Italy', 'Switzerland', 'France', 'UK', 'Australia', 'Singapore', 'Indonesia', 'Greece', 'Spain', 'Monaco', 'Thailand', 'South Africa', 'Mexico'];
  const categories = ['All', 'Luxury Villas', 'Penthouses', 'Architectural Showcases', 'Heritage Estates', 'Chalets'];
  const availabilities = ['All', 'Ready to Move', 'Off-Plan', 'Reserved'];

  const hasActiveFilters = selectedCategory !== 'All' || selectedCountry !== 'All' || selectedPurpose !== 'All' || selectedAvailability !== 'All' || budgetFilter !== 'All';

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCountry('All');
    setSelectedPurpose('All');
    setSelectedAvailability('All');
    setBudgetFilter('All');
    setSearchQuery('');
  };

  return (
    <main className="pt-36 bg-[#fdf8f8] min-h-screen text-[#1c1b1b]">
      
      {/* Hero Header */}
      <section className="px-6 md:px-20 mb-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block">
            GLOBAL ARCHITECTURAL PORTFOLIO
          </span>
          <h1 className="font-sans text-4xl sm:text-6xl font-semibold max-w-4xl tracking-tight leading-none text-black">
            Stunning <span className="font-serif italic font-normal text-[#755a24]">architecture</span> for curated living.
          </h1>
        </div>
      </section>

      {/* Floating Search & Filter Bar */}
      <section className="px-6 md:px-20 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass bg-white/90 p-4 sm:p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center shadow-xl border border-black/10">
            
            {/* Search Input */}
            <div className="flex-1 w-full flex items-center bg-[#f7f3f2] px-5 py-3.5 rounded-2xl border border-[#c4c7c7]/30">
              <Search className="w-4 h-4 text-[#858383] mr-3 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by city, country, or title..." 
                className="bg-transparent border-none p-0 text-black placeholder-[#858383] text-sm font-medium focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Drawer Toggle Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`px-6 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md cursor-pointer ${
                hasActiveFilters 
                  ? 'bg-[#755a24] text-white' 
                  : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>

            {/* Search Button */}
            <button className="w-full md:w-auto bg-black text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#755a24] transition-all font-mono text-xs uppercase font-bold tracking-widest shadow-md cursor-pointer">
              <span>Search</span>
            </button>

          </div>

          {/* Active Filter Badges Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 font-mono text-xs">
              <span className="text-[#858383] text-[10px] uppercase tracking-widest font-bold mr-2">Active Filters:</span>
              
              {selectedCountry !== 'All' && (
                <span className="px-3 py-1 rounded-full bg-black text-white text-[11px] flex items-center gap-1.5">
                  <span>Geography: {selectedCountry}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-[#ffdb99]" onClick={() => setSelectedCountry('All')} />
                </span>
              )}

              {selectedPurpose !== 'All' && (
                <span className="px-3 py-1 rounded-full bg-[#755a24] text-white text-[11px] flex items-center gap-1.5 font-bold">
                  <span>Purpose: {selectedPurpose}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSelectedPurpose('All')} />
                </span>
              )}

              {selectedAvailability !== 'All' && (
                <span className="px-3 py-1 rounded-full bg-[#e5e2e1] text-black text-[11px] font-bold flex items-center gap-1.5">
                  <span>Availability: {selectedAvailability}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setSelectedAvailability('All')} />
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 rounded-full bg-[#755a24] text-white text-[11px] flex items-center gap-1.5">
                  <span>Typology: {selectedCategory}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSelectedCategory('All')} />
                </span>
              )}

              {budgetFilter !== 'All' && (
                <span className="px-3 py-1 rounded-full bg-[#e5e2e1] text-black text-[11px] font-bold flex items-center gap-1.5">
                  <span>Budget: {budgetFilter}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-red-600" onClick={() => setBudgetFilter('All')} />
                </span>
              )}

              <button 
                onClick={resetAllFilters}
                className="text-[10px] text-[#755a24] font-bold uppercase hover:underline ml-2 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Properties Grid Feed */}
      <section className="px-6 md:px-20 mb-32 max-w-7xl mx-auto">
        
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e5e2e1] space-y-4 shadow-sm">
            <h3 className="font-serif text-3xl text-black">No Architectural Residences Match Criteria</h3>
            <p className="font-sans text-sm text-[#858383]">Try clearing search filters or changing availability status.</p>
            <button 
              onClick={resetAllFilters}
              className="px-6 py-2.5 rounded-full bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#755a24] transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map(prop => {
              const isBookmarked = bookmarks.includes(prop.id);
              const isComparing = compareList.includes(prop.id);

              const formattedPrice = formatPropertyPrice(prop.price, userCountry, prop.purpose || 'Buy');

              return (
                <div 
                  key={prop.id}
                  onClick={() => openPropertyDetail(prop)}
                  className="group bg-white rounded-2xl border border-[#e5e2e1] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img 
                        src={prop.images[0]} 
                        alt={prop.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white">
                            {prop.country}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#755a24] text-white">
                            {prop.possession || 'Ready'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          {prop.tour360 && (
                            <button 
                              onClick={() => open360Tour(prop)}
                              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#755a24] transition-colors"
                              title="360° Virtual Tour"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button 
                            onClick={() => toggleBookmark(prop.id)}
                            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                              isBookmarked ? 'bg-[#755a24] text-white' : 'bg-black/60 text-white hover:bg-black'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Price Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end text-white">
                        <div>
                          <span className="font-mono text-[10px] text-[#ffdb99] uppercase tracking-widest block">{prop.category}</span>
                          <h4 className="font-sans font-bold text-lg text-white leading-tight">{prop.title}</h4>
                        </div>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#858383]">
                        <MapPin className="w-3.5 h-3.5 text-[#755a24]" />
                        <span>{prop.location}, {prop.country}</span>
                      </div>

                      <p className="font-sans text-xs text-[#444748] line-clamp-2 leading-relaxed font-light">
                        {prop.description}
                      </p>

                      <div className="pt-3 border-t border-[#f1edec] grid grid-cols-3 gap-2 font-mono text-[11px] text-[#1c1b1b]">
                        <div>
                          <span className="text-[#858383] block text-[9px] uppercase">BEDS</span>
                          <span className="font-bold">{prop.bedrooms}</span>
                        </div>
                        <div>
                          <span className="text-[#858383] block text-[9px] uppercase">BATHS</span>
                          <span className="font-bold">{prop.bathrooms}</span>
                        </div>
                        <div>
                          <span className="text-[#858383] block text-[9px] uppercase">AREA</span>
                          <span className="font-bold">{prop.area} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-[#fdf8f8] border-t border-[#e5e2e1] flex justify-between items-center">
                    <div>
                      <span className="font-mono text-[9px] text-[#858383] uppercase tracking-widest block">
                        {prop.purpose === 'Rent' ? 'LEASE RATE' : 'GUIDE PRICE'}
                      </span>
                      <span className="font-sans font-bold text-base text-black">
                        {formattedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={() => toggleCompare(prop)}
                        className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider transition-all ${
                          isComparing ? 'bg-black text-white' : 'border border-[#c4c7c7] text-[#444748] hover:bg-black hover:text-white'
                        }`}
                      >
                        {isComparing ? 'Comparing' : 'Compare'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* --- GEOGRAPHY, AVAILABILITY & TYPOLOGY FILTER MODAL --- */}
      {isFilterOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsFilterOpen(false); }}
          className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-[#fdf8f8] w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-[#c4c7c7] relative space-y-8 text-[#1c1b1b]"
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#e5e2e1]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#755a24]" />
                <h3 className="font-sans text-2xl font-bold">Property Search &amp; Availability Filters</h3>
              </div>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full bg-white border border-[#c4c7c7] text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Availability Status Section */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#755a24] uppercase tracking-widest block">
                1. AVAILABILITY STATUS
              </span>
              <div className="flex flex-wrap gap-2">
                {availabilities.map(st => (
                  <button 
                    key={st}
                    onClick={() => setSelectedAvailability(st)}
                    className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedAvailability === st ? 'bg-black text-white shadow-md' : 'bg-white border border-[#c4c7c7] text-black hover:bg-[#f1edec]'
                    }`}
                  >
                    {st === 'All' ? 'All Statuses' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose Section (Buy vs Rent) */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#755a24] uppercase tracking-widest block">
                2. PURPOSE (TRANSACTION TYPE)
              </span>
              <div className="flex gap-3">
                {['All', 'Buy', 'Rent'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setSelectedPurpose(p)}
                    className={`px-6 py-2.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedPurpose === p ? 'bg-[#755a24] text-white shadow-md' : 'bg-white border border-[#c4c7c7] text-black hover:bg-[#f1edec]'
                    }`}
                  >
                    {p === 'All' ? 'All Purposes' : p === 'Buy' ? 'For Sale (Buy)' : 'For Lease (Rent)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Geography Section */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#755a24] uppercase tracking-widest block">
                3. GEOGRAPHY (17 COUNTRIES)
              </span>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                {countries.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedCountry(c)}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-semibold transition-all cursor-pointer ${
                      selectedCountry === c ? 'bg-black text-white shadow-md' : 'bg-white border border-[#c4c7c7] text-black hover:bg-[#f1edec]'
                    }`}
                  >
                    {c === 'All' ? 'Global All' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Typology Section */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#755a24] uppercase tracking-widest block">
                4. TYPOLOGY (COLLECTIONS)
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat ? 'bg-[#755a24] text-white shadow-md' : 'bg-white border border-[#c4c7c7] text-[#444748] hover:bg-[#f1edec]'
                    }`}
                  >
                    {cat === 'All' ? 'All Collections' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#e5e2e1] flex justify-between items-center">
              <button 
                onClick={resetAllFilters}
                className="font-mono text-xs uppercase font-bold text-[#755a24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>

              <button 
                onClick={() => setIsFilterOpen(false)}
                className="px-8 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#755a24] transition-all shadow-md cursor-pointer"
              >
                Apply Filters ({filteredProperties.length} Properties)
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
