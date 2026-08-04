import React from 'react';
import { WHY_US_FEATURES } from '../../data/mockData';
import { 
  ShieldCheck, Zap, FileText, TrendingUp, CreditCard, Compass, 
  Home, Headphones, Cpu, Eye, Layers, Sparkles 
} from 'lucide-react';

export default function WhyChooseAvenor() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#C9A86A]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#C9A86A]" />;
      case 'FileText': return <FileText className="w-6 h-6 text-[#C9A86A]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#C9A86A]" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-[#C9A86A]" />;
      case 'Compass': return <Compass className="w-6 h-6 text-[#C9A86A]" />;
      case 'Home': return <Home className="w-6 h-6 text-[#C9A86A]" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-[#C9A86A]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#C9A86A]" />;
      case 'Eye': return <Eye className="w-6 h-6 text-[#C9A86A]" />;
      case 'Layers': return <Layers className="w-6 h-6 text-[#C9A86A]" />;
      default: return <Sparkles className="w-6 h-6 text-[#C9A86A]" />;
    }
  };

  return (
    <section id="why-avenor" className="py-24 bg-[#F7F5F2] border-t border-[#E8E5DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-[#C9A86A] tracking-widest uppercase block mb-2">
              07 / Value Proposition
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#111111] tracking-tight">
              Why Discerning Investors Choose Avenor
            </h2>
          </div>
          <p className="text-xs font-mono text-[#111111]/60 uppercase tracking-widest max-w-sm">
            12 Architectural & Advisory Pillars Ensuring Complete Peace of Mind.
          </p>
        </div>

        {/* 12-Grid Features Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_US_FEATURES.map((item, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#E8E5DF] hover:border-[#C9A86A] transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col justify-between"
              data-cursor-text="PILLAR"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F7F5F2] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#181818] transition-all">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-serif text-xl font-normal text-[#111111] mb-2 group-hover:text-[#C9A86A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-light text-[#111111]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E5DF] flex items-center justify-between text-[10px] font-mono text-[#111111]/40 uppercase tracking-widest">
                <span>Pillar {(idx + 1).toString().padStart(2, '0')}</span>
                <span>AVENOR CERTIFIED</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
