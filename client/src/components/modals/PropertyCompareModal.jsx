import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Layers, Check, Minus, ArrowUpRight } from 'lucide-react';

export default function PropertyCompareModal() {
  const { compareList, toggleCompare, properties, isCompareOpen, closeCompareModal, openPropertyDetail } = useApp();

  if (!isCompareOpen) return null;

  const comparedProps = properties.filter(p => compareList.includes(p.id));

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCompareModal();
      }}
      className="fixed inset-0 z-[160] bg-[#181818]/90 backdrop-blur-2xl overflow-y-auto p-4 sm:p-6 lg:p-12 animate-in fade-in duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="max-w-6xl mx-auto bg-[#F7F5F2] rounded-3xl overflow-hidden border border-[#E8E5DF] shadow-2xl relative p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-[#E8E5DF] mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A86A] uppercase tracking-widest mb-1">
              <Layers className="w-4 h-4" />
              <span>Property Comparison Matrix</span>
            </div>
            <h2 className="font-serif text-3xl font-normal text-[#111111]">
              Side-by-Side Architectural Evaluation
            </h2>
          </div>

          <button 
            onClick={closeCompareModal}
            className="p-2.5 rounded-full bg-[#181818] text-white hover:bg-[#755a24] transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {comparedProps.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-sm font-mono text-[#111111]/60 uppercase tracking-widest">No properties selected for comparison.</p>
            <p className="text-xs text-[#111111]/50">Click the layers icon on any property card to compare up to 3 listings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-xs font-mono text-[#111111]/40 uppercase tracking-widest w-1/4">Specification</th>
                  {comparedProps.map(p => (
                    <th key={p.id} className="p-4 text-left min-w-[240px]">
                      <div className="space-y-3 relative group">
                        <img src={p.images[0]} alt={p.title} className="w-full h-32 rounded-2xl object-cover border border-[#E8E5DF]" />
                        <button 
                          onClick={() => toggleCompare(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-[#181818] text-white text-xs"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <h4 className="font-serif text-lg text-[#111111] font-normal leading-snug">{p.title}</h4>
                        <span className="font-serif text-lg font-bold text-[#C9A86A] block">₹{(p.price / 10000000).toFixed(2)} Cr</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF] text-xs font-mono text-[#111111]">
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Location</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4">{p.location}</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Category</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4">{p.category}</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Built-Up Area</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4">{p.area} sqft</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Bedrooms / Baths</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4">{p.bedrooms} Beds / {p.bathrooms} Baths</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Investment Score</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4 font-bold text-[#C9A86A]">{p.metrics.investmentScore}/100</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Rental Yield</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4">{p.metrics.rentalYield}</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Possession</td>
                  {comparedProps.map(p => <td key={p.id} className="p-4 text-emerald-600 font-bold">{p.possession}</td>)}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#111111]/60">Action</td>
                  {comparedProps.map(p => (
                    <td key={p.id} className="p-4">
                      <button 
                        onClick={() => { setIsCompareOpen(false); openPropertyDetail(p); }}
                        className="w-full py-2.5 rounded-xl bg-[#111111] text-[#F7F5F2] hover:bg-[#C9A86A] hover:text-[#181818] transition-all font-sans font-medium uppercase text-[10px] tracking-wider"
                      >
                        Inspect Property
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
