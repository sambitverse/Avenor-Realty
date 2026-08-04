import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Download, Eye, MapPin, Share2, Layers, CheckCircle, Tag, Clock, Globe } from 'lucide-react';
import { formatPropertyPrice, COUNTRY_CURRENCIES } from '../../utils/currencyHelper';

export default function PropertyDetailModal() {
  const { 
    isDetailOpen,
    selectedProperty, 
    closePropertyDetail, 
    openBookingModal, 
    open360Tour, 
    user 
  } = useApp();

  const [activePurpose, setActivePurpose] = useState('Buy'); // 'Buy' | 'Rent'
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  if (!isDetailOpen || !selectedProperty) return null;

  const prop = selectedProperty;
  const userCountry = user?.preferredCountry || prop.country || 'India';

  const formattedSalePrice = formatPropertyPrice(prop.price, userCountry, 'Buy');
  const formattedRentPrice = formatPropertyPrice(prop.price, userCountry, 'Rent');

  const downPaymentAmt = Math.round((prop.price * downPaymentPct) / 100);
  const loanAmt = prop.price - downPaymentAmt;
  const estMonthly = Math.round((loanAmt * 0.085) / 12);

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closePropertyDetail();
      }}
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#fdf8f8] w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-[#c4c7c7] relative max-h-[92vh] flex flex-col text-[#1c1b1b]"
      >
        
        {/* Floating Close Button */}
        <button 
          onClick={() => closePropertyDetail()}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-[#755a24] transition-all shadow-xl cursor-pointer"
          title="Close Modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto no-scrollbar flex-1">
          
          {/* Luxury Hero Header */}
          <header className="relative w-full min-h-[450px] sm:min-h-[550px] overflow-hidden bg-[#1c1b1b] flex flex-col justify-end p-8 sm:p-16">
            
            {/* Background Giant Text */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16 select-none pointer-events-none opacity-20 text-white">
              <h1 className="font-sans font-bold text-6xl sm:text-9xl leading-none">
                AVENOR<br/>
                <span className="ml-24 font-serif italic">{prop.city}</span>
              </h1>
            </div>

            {/* Right Hero Image Frame */}
            <div className="absolute right-6 top-16 bottom-16 w-full sm:w-1/2 z-0 group overflow-hidden rounded-2xl shadow-2xl border border-white/20 hidden sm:block">
              <img 
                src={prop.images[0]} 
                alt={prop.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 text-white glass p-4 rounded-xl shadow-lg border border-white/40">
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/70">ARCHITECTURAL RESIDENCE</p>
                <p className="font-sans text-lg font-bold text-black">{prop.title}</p>
              </div>
            </div>

            {/* Left Hero Narrative */}
            <div className="relative z-10 max-w-lg space-y-4 text-white">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-[#755a24] text-white font-bold uppercase tracking-wider">
                  {prop.country}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#ffdb99]" />
                  <span>{prop.possession || 'Ready to Move'}</span>
                </span>
              </div>

              <h2 className="font-sans text-3xl sm:text-5xl font-medium leading-tight">
                {prop.subtitle || prop.title}
              </h2>

              <p className="font-sans text-sm text-white/80 font-light leading-relaxed">
                {prop.description}
              </p>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => openBookingModal(prop)}
                  className="bg-white text-black px-6 py-3 rounded-full font-mono text-xs font-semibold uppercase tracking-widest hover:bg-[#755a24] hover:text-white transition-all shadow-md cursor-pointer"
                >
                  Book Private Tour
                </button>
                <button 
                  onClick={() => open360Tour(prop)}
                  className="border border-white/40 text-white px-5 py-3 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>360° Studio</span>
                </button>
              </div>
            </div>

          </header>

          {/* Editorial Specs & Vision Grid */}
          <section className="p-8 sm:p-16 grid grid-cols-1 md:grid-cols-12 gap-12 bg-[#fdf8f8]">
            
            {/* Left Main Details */}
            <div className="md:col-span-7 space-y-12">
              
              <h2 className="font-sans text-3xl sm:text-4xl font-medium leading-snug text-black">
                Stunning <span className="font-serif italic font-normal text-[#755a24]">architecture</span> for spaces where people <span className="font-serif italic font-normal">live, work</span>, and <span className="font-serif italic font-normal text-[#755a24]">chill.</span>
              </h2>

              {/* 4 technical Metrics Grid */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#c4c7c7]/30">
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-black text-3xl">architecture</span>
                  <h4 className="font-mono text-[10px] text-[#858383] uppercase tracking-widest">SQUARE FEET</h4>
                  <p className="font-sans text-3xl font-bold text-black">{prop.area?.toLocaleString() || '4,250'}</p>
                </div>
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-black text-3xl">bed</span>
                  <h4 className="font-mono text-[10px] text-[#858383] uppercase tracking-widest font-semibold">BEDROOMS</h4>
                  <p className="font-sans text-3xl font-bold text-black">{prop.bedrooms}</p>
                </div>
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-black text-3xl">pool</span>
                  <h4 className="font-mono text-[10px] text-[#858383] uppercase tracking-widest font-semibold">POOL AREA</h4>
                  <p className="font-sans text-3xl font-bold text-black">980 sqft</p>
                </div>
                <div className="space-y-1">
                  <span className="material-symbols-outlined text-black text-3xl">eco</span>
                  <h4 className="font-mono text-[10px] text-[#858383] uppercase tracking-widest font-semibold">ENERGY RATING</h4>
                  <p className="font-sans text-3xl font-bold text-black">{prop.metrics?.energyRating || 'A++'}</p>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-4">
                <h3 className="font-sans text-2xl font-bold text-black">Architectural Amenities</h3>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  {(prop.amenities || ["Private Infinity Pool", "Wine Cellar", "Tesla Solar Roof", "24/7 Concierge", "Italian Travertine Flooring"]).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-[#f7f3f2] text-black border border-[#c4c7c7]/20">
                      <CheckCircle className="w-4 h-4 text-[#755a24]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sticky Booking & Mortgage Estimator Panel */}
            <aside className="md:col-span-5 relative">
              <div className="p-8 bg-[#f1edec] rounded-2xl space-y-6 border border-[#c4c7c7]/30 shadow-lg">
                
                {/* BUY VS RENT PURPOSE TOGGLE TABS */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest font-bold">LISTING PURPOSE</span>
                    <span className="text-[10px] font-mono font-bold text-[#755a24] uppercase flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{userCountry} ({COUNTRY_CURRENCIES[userCountry]?.code})</span>
                    </span>
                  </div>

                  {/* Toggle Pill Buttons */}
                  <div className="grid grid-cols-2 gap-2 bg-[#e5e2e1] p-1.5 rounded-2xl font-mono text-xs">
                    <button 
                      onClick={() => setActivePurpose('Buy')}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        activePurpose === 'Buy' ? 'bg-black text-white shadow-md' : 'text-[#444748] hover:text-black'
                      }`}
                    >
                      FOR SALE (BUY)
                    </button>

                    <button 
                      onClick={() => setActivePurpose('Rent')}
                      className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                        activePurpose === 'Rent' ? 'bg-black text-white shadow-md' : 'text-[#444748] hover:text-black'
                      }`}
                    >
                      FOR LEASE (RENT)
                    </button>
                  </div>
                </div>

                {/* Dynamic Price Display */}
                <div className="flex justify-between items-end border-b border-[#c4c7c7]/30 pb-4">
                  <div>
                    <p className="font-mono text-[10px] text-[#858383] uppercase tracking-widest">
                      {activePurpose === 'Buy' ? 'GUIDE PRICE (PURCHASE)' : 'MONTHLY LEASE RATE'}
                    </p>
                    <h2 className="font-sans text-3xl font-bold text-black">
                      {activePurpose === 'Buy' ? formattedSalePrice : formattedRentPrice}
                    </h2>
                  </div>
                  <span className="bg-[#ffdb99] text-[#795f28] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest">
                    {prop.possession || 'READY'}
                  </span>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => openBookingModal(prop)}
                    className="w-full bg-black text-white py-4 rounded-full font-mono text-xs font-semibold tracking-widest hover:bg-[#755a24] transition-all shadow-md uppercase cursor-pointer"
                  >
                    SCHEDULE PRIVATE INSPECTION
                  </button>
                  <button 
                    onClick={() => alert(`Official brochure downloaded for ${prop.title}`)}
                    className="w-full border border-black text-black py-4 rounded-full font-mono text-xs font-semibold tracking-widest hover:bg-black hover:text-white transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD BROCHURE</span>
                  </button>
                </div>

                {/* Mortgage / Rent Estimator */}
                {activePurpose === 'Buy' ? (
                  <div className="p-6 glass-panel border border-white/50 rounded-xl space-y-4 bg-white/70">
                    <h4 className="font-mono text-xs font-bold text-black uppercase">MORTGAGE ESTIMATOR</h4>
                    
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[#858383]">{downPaymentPct}% Down Payment</span>
                      <span className="font-bold text-black">₹{(downPaymentAmt / 100000).toFixed(1)} Lakh</span>
                    </div>

                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={downPaymentPct}
                      onChange={e => setDownPaymentPct(Number(e.target.value))}
                      className="w-full accent-black cursor-pointer"
                    />

                    <div className="flex justify-between items-baseline pt-2 font-mono">
                      <span className="text-[10px] text-[#858383] uppercase">EST. MONTHLY EMI</span>
                      <span className="text-xl font-bold text-[#755a24]">₹{estMonthly.toLocaleString()}/mo</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 glass-panel border border-white/50 rounded-xl space-y-3 bg-white/70 font-mono text-xs">
                    <h4 className="font-bold text-black uppercase">LEASE TERMS &amp; DEPOSIT</h4>
                    <div className="flex justify-between text-[#444748]">
                      <span>Security Deposit:</span>
                      <span className="font-bold text-black">2 Months Lease</span>
                    </div>
                    <div className="flex justify-between text-[#444748]">
                      <span>Min Lease Term:</span>
                      <span className="font-bold text-black">12 Months</span>
                    </div>
                    <div className="flex justify-between text-[#444748]">
                      <span>Maintenance Included:</span>
                      <span className="font-bold text-emerald-700">Yes (Complimentary)</span>
                    </div>
                  </div>
                )}

              </div>
            </aside>

          </section>

          {/* Masonry Editorial Gallery Section */}
          <section className="bg-[#f7f3f2] p-8 sm:p-16 border-t border-[#c4c7c7]/30 space-y-12">
            <div className="max-w-xl">
              <h2 className="font-sans text-3xl font-bold text-black">Comfort <span className="font-serif italic font-normal text-[#755a24]">x</span> Nature</h2>
              <p className="font-sans text-sm text-[#444748] font-light mt-1">A curated visual journey through the textures and atmospheres of {prop.title}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prop.images.map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-black/10">
                  <img src={img} alt={`Gallery view ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
