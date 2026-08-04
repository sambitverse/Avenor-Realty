import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Eye, Calendar, X, Sparkles } from 'lucide-react';

export default function InteractiveMapSection() {
  const { properties, openPropertyDetail, openBookingModal } = useApp();
  const [selectedPin, setSelectedPin] = useState(properties[0]);

  return (
    <section className="py-24 bg-[#F7F5F2] border-t border-[#E8E5DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              06 / Spatial Geo-Intelligence
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#111111] tracking-tight">
              Interactive Landmark Map
            </h2>
          </div>
          <p className="text-xs font-mono text-[#111111]/60 uppercase tracking-widest max-w-sm">
            Select pins across coastal reserves, sky districts, and urban sanctuaries.
          </p>
        </div>

        {/* Visual Map Canvas Container */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8E5DF] bg-[#181818] h-[550px] shadow-2xl group">
          
          {/* Map Graphical Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#C9A86A_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#181818] via-transparent to-[#181818]/60 pointer-events-none" />

          {/* Interactive Property Map Pins (Spread across grid) */}
          <div className="absolute inset-0 p-12 flex flex-wrap items-center justify-around z-10">
            {properties.map((prop, idx) => {
              const isSelected = selectedPin?.id === prop.id;
              return (
                <div 
                  key={prop.id}
                  onClick={() => setSelectedPin(prop)}
                  className={`relative cursor-pointer transition-all duration-500 transform hover:scale-125 ${
                    isSelected ? 'z-30 scale-110' : 'z-10'
                  }`}
                  style={{
                    transform: `translate(${(idx % 3 - 1) * 60}px, ${(Math.floor(idx / 2) - 1) * 40}px)`
                  }}
                  data-cursor-text="PIN"
                >
                  {/* Pulse Ring */}
                  <div className={`absolute -inset-2 rounded-full bg-[#C9A86A]/30 animate-ping ${isSelected ? 'block' : 'hidden'}`} />
                  
                  {/* Pin Capsule */}
                  <div className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border transition-all ${
                    isSelected 
                      ? 'bg-[#C9A86A] text-[#181818] border-white font-bold scale-110' 
                      : 'bg-[#181818]/90 text-[#F7F5F2] border-[#C9A86A]/40 hover:bg-[#C9A86A] hover:text-[#181818]'
                  }`}>
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-serif whitespace-nowrap">
                      {prop.title.split(' ')[0]} • ₹{(prop.price / 10000000).toFixed(1)}Cr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Selected Pin Preview Popup Card */}
          {selectedPin && (
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-[#181818]/95 backdrop-blur-xl text-[#F7F5F2] p-6 rounded-2xl border border-[#C9A86A]/40 shadow-2xl z-40 animate-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono text-[#C9A86A] uppercase tracking-widest">
                  {selectedPin.location}
                </span>
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 mb-4">
                <img 
                  src={selectedPin.images[0]} 
                  alt={selectedPin.title} 
                  className="w-24 h-20 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-serif text-lg font-normal text-white">
                    {selectedPin.title}
                  </h4>
                  <p className="text-xs text-[#F7F5F2]/70 font-light mt-0.5">
                    {selectedPin.area} sqft • {selectedPin.bedrooms} Beds
                  </p>
                  <span className="text-sm font-serif font-semibold text-[#C9A86A] block mt-1">
                    ₹{(selectedPin.price / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => openPropertyDetail(selectedPin)}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#181818] text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button 
                  onClick={() => openBookingModal(selectedPin)}
                  className="py-2 px-3 rounded-xl bg-[#C9A86A] hover:bg-white text-[#181818] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
