import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Maximize2, Compass, Layers, Sparkles, MapPin } from 'lucide-react';

export default function VirtualTour360Section() {
  const { properties, open360Tour } = useApp();
  const sampleProp = properties[0]; // The Solstice Pavilion

  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const rooms = sampleProp?.tour360 || [
    { room: "Living Pavilion", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85", hotspot: "Floating Ethanol Fireplace" },
    { room: "Master Suite", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85", hotspot: "Freestanding Italian Marble Tub" },
    { room: "Infinity Terrace", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85", hotspot: "Panoramic Ocean Sunset View" }
  ];

  const currentRoom = rooms[activeRoomIndex];

  return (
    <section className="py-24 bg-[#181818] text-[#F7F5F2] relative border-y border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              08 / Virtual Spatial Reality
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-white tracking-tight">
              Interactive 360° Room Walkthrough
            </h2>
          </div>
          
          <button 
            onClick={() => open360Tour(sampleProp)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A86A] text-[#181818] font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl"
            data-cursor-text="FULLSCREEN"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Launch Fullscreen 360° Studio</span>
          </button>
        </div>

        {/* 360° Spatial Canvas Container */}
        <div className="relative rounded-3xl overflow-hidden border border-[#333333] bg-[#242424] h-[600px] shadow-2xl group">
          
          {/* Main Panorama Image */}
          <img 
            src={currentRoom.image} 
            alt={currentRoom.room}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-[#181818]/50 pointer-events-none" />

          {/* Floating Hotspot Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative group/hotspot">
              <div className="w-8 h-8 rounded-full bg-[#C9A86A]/40 animate-ping absolute inset-0" />
              <button className="relative w-8 h-8 rounded-full bg-[#C9A86A] text-[#181818] flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-white">
                <Sparkles className="w-4 h-4" />
              </button>

              {/* Hotspot Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 bg-[#181818] text-[#F7F5F2] px-4 py-2 rounded-xl text-xs font-serif whitespace-nowrap border border-[#C9A86A] shadow-2xl opacity-90 group-hover/hotspot:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-[#C9A86A] uppercase tracking-widest block">Architectural Feature</span>
                <span>{currentRoom.hotspot}</span>
              </div>
            </div>
          </div>

          {/* Top Room Selector Pills */}
          <div className="absolute top-6 left-6 right-6 flex flex-wrap justify-between items-center gap-4 z-20">
            <div className="flex items-center gap-2 bg-[#181818]/80 backdrop-blur-md p-1.5 rounded-full border border-white/10">
              {rooms.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRoomIndex(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                    activeRoomIndex === idx ? 'bg-[#C9A86A] text-[#181818] font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {r.room}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A86A] uppercase tracking-widest bg-[#181818]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Drag or Click Hotspots</span>
            </div>
          </div>

          {/* Bottom Left Mini Floorplan Radar Indicator */}
          <div className="absolute bottom-6 left-6 bg-[#181818]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs font-mono z-20 hidden md:block">
            <span className="text-[#C9A86A] uppercase tracking-widest block mb-2">Mini Floorplan Position</span>
            <div className="w-28 h-20 bg-[#242424] border border-white/20 rounded-lg relative flex items-center justify-center">
              <span className="text-[9px] text-white/40 uppercase">Level 02</span>
              <div 
                className="w-3 h-3 rounded-full bg-[#C9A86A] absolute transition-all duration-500 shadow-lg border border-white"
                style={{
                  top: activeRoomIndex === 0 ? '30%' : activeRoomIndex === 1 ? '70%' : '50%',
                  left: activeRoomIndex === 0 ? '40%' : activeRoomIndex === 1 ? '80%' : '20%'
                }}
              />
            </div>
          </div>

          {/* Bottom Right Property Tag */}
          <div className="absolute bottom-6 right-6 bg-[#181818]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs text-right z-20">
            <span className="text-[#C9A86A] font-mono uppercase tracking-widest block">Active Viewpoint</span>
            <span className="font-serif text-lg text-white font-normal block">{sampleProp.title}</span>
            <span className="text-white/60 font-light text-[11px]">{currentRoom.room}</span>
          </div>

        </div>

      </div>
    </section>
  );
}
