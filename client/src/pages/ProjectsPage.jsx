import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Layers, ArrowUpRight, CheckCircle2, Building, Compass } from 'lucide-react';

export default function ProjectsPage() {
  const { openBookingModal } = useApp();
  const [filterPhase, setFilterPhase] = useState('All');

  const projects = [
    {
      id: "proj-1",
      name: "The Solstice Pavilion at Alibaug Coast",
      phase: "Q3 2026",
      status: "Final Handover Phase",
      progress: 95,
      category: "Coastal Villas",
      location: "Alibaug, India",
      description: "12 oceanfront residences featuring cantilevered infinity pools, private yacht berths, and raw volcanic basalt stone walls.",
      architect: "Studio Khora & Avenor Signature",
      units: "12 Private Residences",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      features: ["Private Yacht Berth", "Helipad Access", "Tesla Solar Roof", "25m Infinity Pool"]
    },
    {
      id: "proj-2",
      name: "Obsidian Skyscraper Tower",
      phase: "Q4 2026",
      status: "Interior Fit-outs",
      progress: 82,
      category: "Super-Tall Penthouses",
      location: "Downtown, Dubai",
      description: "54-story supertall architectural landmark in Downtown Dubai with private sky sanctuaries and 360° Burj Khalifa vistas.",
      architect: "Emaar & Foster + Partners",
      units: "48 Duplex Penthouses",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      features: ["Private Sky Elevator", "Burj Skyline View", "360 Observatory", "Subterranean Car Vault"]
    },
    {
      id: "proj-3",
      name: "Natura Forest Eco-Estates",
      phase: "Q1 2027",
      status: "Foundation & Superstructure",
      progress: 48,
      category: "Eco-Bungalows",
      location: "District 10, Singapore",
      description: "Zero-carbon luxury bungalows nestled in Singapore's lush green corridor with self-sustaining vertical rainforest gardens.",
      architect: "Kengo Kuma & Associates",
      units: "8 Good Class Bungalows",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      features: ["Zero-Carbon Solar Battery", "Rainforest Atrium", "Saltwater Pool", "Rainwater Harvesting"]
    },
    {
      id: "proj-4",
      name: "Kyoto Higashiyama Sanctuary",
      phase: "Q2 2027",
      status: "Architectural Planning & Land Prep",
      progress: 25,
      category: "Zen Estates",
      location: "Kyoto, Japan",
      description: "Traditional hinoki timber & steel mountain estates facing Kiyomizu-dera with private onsen thermal baths.",
      architect: "Tadao Ando Architect & Associates",
      units: "6 Private Compounds",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
      features: ["Natural Hinoki Onsen", "Zen Rock Garden", "Tea House Pavilion", "Seismic Isolation Base"]
    },
    {
      id: "proj-5",
      name: "Matterhorn Alpine Glacier Refuge",
      phase: "Q3 2027",
      status: "Site Acquisition & Excavation",
      progress: 15,
      category: "Alpine Chalets",
      location: "Zermatt, Switzerland",
      description: "Ultra-exclusive ski-in ski-out chalets positioned directly facing the Matterhorn glacier peak.",
      architect: "Swiss Alpine Architecture",
      units: "4 Ski Chalets",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
      features: ["Ski-In Ski-Out Access", "Indoor Thermal Pool", "Glacier View Deck", "Underground Ski Gallery"]
    }
  ];

  const filteredProjects = filterPhase === 'All' ? projects : projects.filter(p => p.category === filterPhase);

  return (
    <main className="pt-36 bg-[#fdf8f8] min-h-screen text-[#1c1b1b]">
      
      {/* Hero Header */}
      <section className="px-6 md:px-20 mb-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#755a24] uppercase tracking-[0.3em] font-bold">
            <Building className="w-4 h-4" />
            <span>AVENOR ARCHITECTURAL DEVELOPMENTS</span>
          </div>
          
          <h1 className="font-sans text-4xl sm:text-6xl font-bold tracking-tight text-black max-w-5xl leading-tight">
            Flagship <span className="font-serif italic font-normal text-[#755a24]">developments</span> shaping future skylines.
          </h1>
          
          <p className="font-sans text-base sm:text-lg text-[#444748] font-light max-w-3xl leading-relaxed">
            Explore our global portfolio of active, under-construction, and newly delivered architectural developments across prime international locations.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-6 md:px-20 mb-12">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar font-mono text-xs">
          {['All', 'Coastal Villas', 'Super-Tall Penthouses', 'Eco-Bungalows', 'Zen Estates', 'Alpine Chalets'].map(phase => (
            <button 
              key={phase}
              onClick={() => setFilterPhase(phase)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                filterPhase === phase ? 'bg-black text-white shadow-md' : 'bg-white border border-[#e5e2e1] text-[#444748] hover:bg-[#f1edec]'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 md:px-20 mb-28">
        <div className="max-w-7xl mx-auto space-y-16">
          {filteredProjects.map(proj => (
            <div 
              key={proj.id}
              className="bg-white rounded-3xl border border-[#e5e2e1] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-0 group"
            >
              {/* Left Image & Overlay */}
              <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[480px] overflow-hidden bg-black">
                <img 
                  src={proj.image} 
                  alt={proj.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                  <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest border border-white/20">
                    {proj.category}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#755a24] text-white font-mono text-xs uppercase font-bold tracking-widest">
                    {proj.phase}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-10 text-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#ffdb99]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{proj.location}</span>
                  </div>
                  <h3 className="font-sans text-3xl font-bold">{proj.name}</h3>
                </div>
              </div>

              {/* Right Content Specs & Progress */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#fdf8f8]">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#e5e2e1]">
                    <div>
                      <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest block">DEVELOPMENT STATUS</span>
                      <span className="font-sans text-sm font-bold text-black">{proj.status}</span>
                    </div>
                    <span className="font-mono text-xl font-bold text-[#755a24]">{proj.progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#e5e2e1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#755a24] rounded-full transition-all duration-1000" style={{ width: `${proj.progress}%` }} />
                  </div>

                  <p className="font-sans text-sm text-[#444748] leading-relaxed font-light">
                    {proj.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#e5e2e1]">
                      <span className="text-[#858383] block text-[9px] uppercase">LEAD ARCHITECT</span>
                      <span className="font-bold text-black text-[11px] truncate block">{proj.architect}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#e5e2e1]">
                      <span className="text-[#858383] block text-[9px] uppercase">TOTAL UNITS</span>
                      <span className="font-bold text-black text-[11px] block">{proj.units}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest block">KEY AMENITIES &amp; TECH</span>
                    <div className="flex flex-wrap gap-2">
                      {proj.features.map((feat, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-[#e5e2e1] rounded-full text-[11px] font-mono text-black flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#755a24]" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => openBookingModal(null)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#755a24] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Inquire Development Access</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
