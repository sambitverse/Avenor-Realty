import React, { useState } from 'react';
import { AGENTS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MessageSquare, Calendar, Send, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  const { openBookingModal } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Buying',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', interest: 'Buying', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 bg-white text-[#1c1b1b] relative border-t border-[#e5e2e1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="font-mono text-xs text-[#755a24] uppercase tracking-[0.3em] font-bold block mb-2">
              GET IN TOUCH
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-black tracking-tight">
              Connect With Our <span className="font-serif italic font-normal text-[#755a24]">Partners</span>
            </h2>
          </div>
          
          <button 
            onClick={() => openBookingModal(null)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#755a24] transition-all shadow-md cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Private Viewing</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Form Box */}
          <div className="lg:col-span-7 bg-[#fdf8f8] p-8 sm:p-12 rounded-3xl border border-[#e5e2e1] shadow-sm">
            <h3 className="font-sans text-2xl font-bold text-black mb-2">
              Inquire About an Estate
            </h3>
            <p className="text-xs text-[#444748] font-light mb-8">
              Fill in your contact preferences and our senior advisory lead will get in touch within 2 hours.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-white border border-[#755a24] text-center space-y-4 shadow-md">
                <CheckCircle2 className="w-12 h-12 text-[#755a24] mx-auto" />
                <h4 className="font-serif text-2xl text-black">Inquiry Received</h4>
                <p className="text-xs text-[#444748]">Thank you. Senior Advisor Marcus Vance has received your dossier and will reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-[#755a24] font-bold uppercase tracking-widest block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexander Wright"
                      className="w-full bg-white border border-[#c4c7c7] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#755a24] font-bold uppercase tracking-widest block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="investor@domain.com"
                      className="w-full bg-white border border-[#c4c7c7] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-[#755a24] font-bold uppercase tracking-widest block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 00000"
                      className="w-full bg-white border border-[#c4c7c7] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#755a24] font-bold uppercase tracking-widest block mb-1">Primary Interest</label>
                    <select 
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full bg-white border border-[#c4c7c7] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium cursor-pointer"
                    >
                      <option value="Buying">Buying a Landmark Estate</option>
                      <option value="Renting">Leasing a Sky Penthouse</option>
                      <option value="Commercial">Commercial Portfolio Advisory</option>
                      <option value="Sell">Listing Property on Avenor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#755a24] font-bold uppercase tracking-widest block mb-1">Confidential Notes</label>
                  <textarea 
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify target location, timeline, or special requirements..."
                    className="w-full bg-white border border-[#c4c7c7] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white hover:bg-[#755a24] font-mono text-xs uppercase font-bold py-3.5 rounded-xl tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Confidential Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Partner Agent Cards Box */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-sans text-2xl font-bold text-black">
              Senior Advisory Leads
            </h3>

            <div className="space-y-4">
              {AGENTS.map((agent) => (
                <div 
                  key={agent.id}
                  className="p-5 rounded-2xl bg-white border border-[#e5e2e1] hover:border-[#755a24] shadow-xs transition-all flex items-center gap-4 group"
                >
                  <img 
                    src={agent.photo} 
                    alt={agent.name}
                    className="w-14 h-14 rounded-full object-cover border border-[#755a24]" 
                  />
                  <div className="w-full">
                    <h4 className="font-sans text-lg font-bold text-black group-hover:text-[#755a24] transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] font-light text-[#444748] mb-2">
                      {agent.role}
                    </p>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-700 hover:text-white text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 border border-emerald-300 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                      <a 
                        href={`tel:${agent.phone}`} 
                        className="px-3 py-1 rounded-full bg-black text-white hover:bg-[#755a24] text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#ffdb99]" /> Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Offices */}
            <div className="p-6 rounded-2xl bg-white border border-[#e5e2e1] shadow-xs space-y-2 text-xs font-mono">
              <span className="text-[#755a24] font-bold uppercase tracking-widest block mb-2">Global Advisory Studios</span>
              <p className="text-[#444748] flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#755a24]" /> Mumbai: Maker Maxity, BKC, Mumbai 400051</p>
              <p className="text-[#444748] flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#755a24]" /> Dubai: Opus Tower by Zaha Hadid, Business Bay</p>
              <p className="text-[#444748] flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#755a24]" /> Singapore: 1 Marina Boulevard, Marina Bay</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
