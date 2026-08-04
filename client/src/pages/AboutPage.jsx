import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AGENTS, TESTIMONIALS } from '../data/mockData';
import { MapPin, ShieldCheck, Zap, Compass, Award, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { openBookingModal } = useApp();

  const companyStats = [
    { value: "₹850Cr+", label: "Portfolio Transacted", desc: "Institutional & HNI real estate volume executed" },
    { value: "18+", label: "Global Metro Cities", desc: "Presence across India, Dubai, London, Singapore, New York" },
    { value: "42-Point", label: "Legal Audit Policy", desc: "Uncompromising title verification by senior real estate counsel" },
    { value: "100%", label: "Zero Brokerage Friction", desc: "Direct direct-to-owner advisory model" }
  ];

  const executiveBoard = [
    {
      name: "Marcus Vance",
      role: "Managing Partner & Founder",
      bio: "Former Principal Architect at Foster + Partners with 20+ years executing coastal luxury compounds across South Asia and Europe.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      location: "Mumbai & Zurich"
    },
    {
      name: "Soraya Al-Mansoor",
      role: "Partner — Middle East & Gulf Advisory",
      bio: "Spearheaded $1.2B in supertall penthouse transactions across Downtown Dubai, Palm Jumeirah, and Abu Dhabi.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      location: "Dubai & London"
    },
    {
      name: "Chen Wei",
      role: "Partner — SE Asia & Asia-Pacific",
      bio: "Over two decades in District 10 Singapore Good Class Bungalow developments and Tokyo skyline acquisitions.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      location: "Singapore & Tokyo"
    }
  ];

  const globalStudios = [
    { city: "Mumbai Studio", address: "High Ridge Reserve, Alibaug / Worli Sea Face, Mumbai 400018", phone: "+91 98200 11223" },
    { city: "Dubai Studio", address: "Obsidian Tower, Suite 450, Business Bay, Downtown Dubai", phone: "+971 50 123 4567" },
    { city: "Singapore Studio", address: "32 Nassim Road, District 10, Singapore 258411", phone: "+65 9123 4567" },
    { city: "London Studio", address: "14 Ennismore Gardens, Knightsbridge, London SW7", phone: "+44 20 7946 0912" }
  ];

  return (
    <main className="pt-36 bg-[#fdf8f8] min-h-screen text-[#1c1b1b]">
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 mb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <span className="font-mono text-xs text-[#755a24] uppercase tracking-[0.3em] font-bold block">
            COMPANY &amp; ARCHITECTURAL HERITAGE
          </span>
          <h1 className="font-sans text-5xl sm:text-7xl font-semibold max-w-5xl tracking-tight leading-tight text-black">
            Curating spaces where <span className="font-serif italic font-normal text-[#755a24]">architecture</span> elevates the human spirit.
          </h1>
          <p className="font-sans text-lg text-[#444748] font-light max-w-3xl leading-relaxed">
            Founded in 2012, Avenor is a private architectural real estate advisory bridging the gap between world-renowned master architects and ultra-high-net-worth investors. Rooted in Swiss precision engineering, biophilic Scandinavian sustainability, and raw brutalist geometry.
          </p>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="px-6 md:px-20 py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {companyStats.map((stat, i) => (
            <div key={i} className="space-y-2 border-l-2 border-[#755a24] pl-6">
              <span className="font-sans text-4xl font-bold text-white">{stat.value}</span>
              <p className="font-mono text-xs text-[#ffdb99] uppercase tracking-widest">{stat.label}</p>
              <p className="font-sans text-xs text-white/60 font-light">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Philosophy Pillars */}
      <section className="px-6 md:px-20 py-24 bg-[#f7f3f2] border-b border-[#c4c7c7]/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block mb-2">OUR PHILOSOPHY</span>
            <h2 className="font-sans text-4xl font-bold text-black">The 3 Core Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 bg-white rounded-3xl border border-[#e5e2e1] shadow-xs">
              <ShieldCheck className="w-10 h-10 text-[#755a24]" />
              <h3 className="font-sans text-2xl font-bold text-black">Swiss Precision</h3>
              <p className="font-sans text-sm text-[#444748] font-light leading-relaxed">
                Every residence undergoes a rigorous 42-point structural &amp; legal clearance by senior attorneys before appearing on our private registry.
              </p>
            </div>

            <div className="space-y-4 p-8 bg-white rounded-3xl border border-[#e5e2e1] shadow-xs">
              <Compass className="w-10 h-10 text-[#755a24]" />
              <h3 className="font-sans text-2xl font-bold text-black">Biophilic Integration</h3>
              <p className="font-sans text-sm text-[#444748] font-light leading-relaxed">
                We prioritize zero-carbon solar battery microgrids, natural rainwater harvesting, and locally-sourced volcanic basalt and teak wood.
              </p>
            </div>

            <div className="space-y-4 p-8 bg-white rounded-3xl border border-[#e5e2e1] shadow-xs">
              <Zap className="w-10 h-10 text-[#755a24]" />
              <h3 className="font-sans text-2xl font-bold text-black">Zero Brokerage Friction</h3>
              <p className="font-sans text-sm text-[#444748] font-light leading-relaxed">
                Direct direct-to-owner engagement with transparent flat advisory fees, escrow protection, and turnkey asset management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Partners */}
      <section className="px-6 md:px-20 py-24">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block mb-2">LEADERSHIP</span>
              <h2 className="font-sans text-4xl font-bold text-black">Senior Advisory Partners</h2>
            </div>
            <button 
              onClick={() => openBookingModal(null)}
              className="px-6 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#755a24] transition-all"
            >
              Consult Partners
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {executiveBoard.map((exec, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#e5e2e1] shadow-md group">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                  <img src={exec.image} alt={exec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl text-white font-mono text-xs flex items-center justify-between">
                    <span>{exec.location}</span>
                    <MapPin className="w-3.5 h-3.5 text-[#ffdb99]" />
                  </div>
                </div>
                <div className="p-8 space-y-3">
                  <h3 className="font-sans text-2xl font-bold text-black">{exec.name}</h3>
                  <p className="font-mono text-xs text-[#755a24] font-bold uppercase">{exec.role}</p>
                  <p className="font-sans text-xs text-[#444748] font-light leading-relaxed pt-2">{exec.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Studios Grid */}
      <section className="px-6 md:px-20 py-20 bg-[#f7f3f2] border-t border-[#c4c7c7]/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <span className="font-mono text-xs text-[#858383] uppercase tracking-[0.3em] block mb-2">LOCATIONS</span>
            <h2 className="font-sans text-4xl font-bold text-black">Global Advisory Studios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalStudios.map((studio, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-[#e5e2e1] space-y-3 shadow-xs">
                <span className="font-sans text-xl font-bold text-black block">{studio.city}</span>
                <p className="font-sans text-xs text-[#444748] font-light leading-relaxed">{studio.address}</p>
                <p className="font-mono text-xs text-[#755a24] font-bold">{studio.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
