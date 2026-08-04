import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, Clock, Search, Calendar, Bell, MessageSquare, User, ShieldCheck, ArrowUpRight, Eye, Globe, Settings, Check, MapPin } from 'lucide-react';
import { COUNTRY_CURRENCIES, formatPropertyPrice } from '../../utils/currencyHelper';

export default function UserDashboard() {
  const { 
    user, 
    setUser,
    bookmarks, 
    properties, 
    recentlyViewed, 
    appointments,
    openPropertyDetail 
  } = useApp();

  const [tab, setTab] = useState('wishlist'); // 'wishlist' | 'recent' | 'inspections' | 'settings'
  const [selectedCountry, setSelectedCountry] = useState(user?.preferredCountry || 'India');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen pt-36 bg-[#F7F5F2] text-[#111111] text-center p-8">
        <h2 className="font-serif text-3xl font-bold mb-4">Please Log In or Sign Up</h2>
        <p className="text-xs font-mono text-[#858383] mb-6">Authenticate to access your private HNI portfolio and currency preferences.</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold">
          Return to Home
        </button>
      </div>
    );
  }

  const savedProps = properties.filter(p => bookmarks.includes(p.id));
  const recentProps = properties.filter(p => recentlyViewed.includes(p.id));
  
  // User's booked visits
  const myAppointments = appointments.filter(a => 
    !a.clientEmail || a.clientEmail.toLowerCase() === user.email.toLowerCase() || a.clientName.toLowerCase() === user.name.toLowerCase()
  );

  const countriesList = Object.keys(COUNTRY_CURRENCIES);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      preferredCountry: selectedCountry
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F7F5F2] text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Header Profile Banner */}
        <div className="bg-[#181818] text-[#F7F5F2] p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#333333] shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#242424] border-2 border-[#C9A86A] text-[#C9A86A] font-serif font-bold text-2xl flex items-center justify-center shadow-inner">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white">{user.name}</h1>
                <span className="bg-[#C9A86A] text-[#181818] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {user.role === 'admin' ? 'Admin Principal' : 'Verified HNI Client'}
                </span>
              </div>
              <p className="text-xs text-[#F7F5F2]/60 font-mono mt-1 flex items-center gap-2">
                <span>{user.email}</span>
                <span>•</span>
                <span className="text-[#C9A86A] font-bold">Country Preference: {user.preferredCountry || 'India'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white hover:bg-white hover:text-[#181818] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-[#E8E5DF] pb-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'wishlist', label: 'Saved Wishlist', icon: Bookmark, count: savedProps.length },
            { id: 'recent', label: 'Recently Inspected', icon: Clock, count: recentProps.length },
            { id: 'inspections', label: 'Booked Private Inspections', icon: Calendar, count: myAppointments.length },
            { id: 'settings', label: 'Country & Currency Settings', icon: Globe }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button 
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  tab === t.id ? 'bg-[#181818] text-white shadow-md' : 'bg-white text-[#444748] hover:bg-[#E8E5DF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === t.id ? 'bg-[#C9A86A] text-[#181818]' : 'bg-[#E8E5DF] text-black'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: WISHLIST */}
        {tab === 'wishlist' && (
          <div>
            {savedProps.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF]">
                <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No saved properties in your portfolio.</p>
                <p className="text-xs text-[#111111]/60 font-sans mt-2">Explore residences and click the bookmark icon to save them to your private wishlist.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProps.map(prop => (
                  <div key={prop.id} onClick={() => openPropertyDetail(prop)} className="bg-white rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-xs cursor-pointer group hover:shadow-xl transition-all">
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="p-5 space-y-2">
                      <h4 className="font-serif text-lg font-bold text-[#181818]">{prop.title}</h4>
                      <p className="text-xs text-[#858383] font-mono">{prop.location}, {prop.country}</p>
                      <p className="font-sans text-base font-bold text-[#755a24]">
                        {formatPropertyPrice(prop.price, user.preferredCountry || prop.country, prop.purpose || 'Buy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECENT */}
        {tab === 'recent' && (
          <div>
            {recentProps.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF]">
                <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No recently inspected residences.</p>
                <p className="text-xs text-[#111111]/60 font-sans mt-2">Any residence view or architectural dossier inspected during this session will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProps.map(prop => (
                  <div key={prop.id} onClick={() => openPropertyDetail(prop)} className="bg-white rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-xs cursor-pointer group hover:shadow-xl transition-all">
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="p-5 space-y-2">
                      <h4 className="font-serif text-lg font-bold text-[#181818]">{prop.title}</h4>
                      <p className="text-xs text-[#858383] font-mono">{prop.location}, {prop.country}</p>
                      <p className="font-sans text-base font-bold text-[#755a24]">
                        {formatPropertyPrice(prop.price, user.preferredCountry || prop.country, prop.purpose || 'Buy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKED PRIVATE INSPECTIONS & VISITS */}
        {tab === 'inspections' && (
          <div>
            {myAppointments.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF]">
                <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No scheduled private inspections.</p>
                <p className="text-xs text-[#111111]/60 font-sans mt-2">When you tap "Schedule Private Inspection" on any residence, your appointment details will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAppointments.map(app => (
                  <div key={app.id} className="bg-white rounded-2xl p-6 border border-[#E8E5DF] shadow-sm flex flex-col justify-between space-y-4">
                    <div className="flex gap-4 items-start">
                      <img src={app.image} alt={app.propertyTitle} className="w-20 h-20 rounded-xl object-cover border border-[#E8E5DF]" />
                      <div className="space-y-1">
                        <span className="bg-[#ffdb99] text-[#795f28] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                          {app.status || 'Confirmed'}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-black">{app.propertyTitle}</h4>
                        <p className="text-xs text-[#858383] font-mono flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#755a24]" />
                          <span>{app.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E5DF] flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-[#858383] uppercase text-[10px] block">INSPECTION DATE</span>
                        <span className="font-bold text-black">{app.date} at {app.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#858383] uppercase text-[10px] block">CLIENT CONTACT</span>
                        <span className="font-bold text-black">{app.clientPhone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUNTRY & CURRENCY SETTINGS */}
        {tab === 'settings' && (
          <div className="max-w-2xl bg-white p-8 rounded-3xl border border-[#E8E5DF] shadow-md space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-black">Country &amp; Currency Preference</h3>
              <p className="text-xs text-[#858383] font-mono mt-1">
                Select your default country. Property valuations across the entire website will automatically adjust to your preferred currency.
              </p>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-[#755a24] uppercase tracking-widest block mb-2">
                  Select Preferred Country &amp; Currency
                </label>

                <select 
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full p-4 bg-[#F7F5F2] border border-[#c4c7c7] rounded-2xl text-sm font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                >
                  {countriesList.map(country => (
                    <option key={country} value={country}>
                      {country} — {COUNTRY_CURRENCIES[country].name} ({COUNTRY_CURRENCIES[country].code} {COUNTRY_CURRENCIES[country].symbol})
                    </option>
                  ))}
                </select>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Preferences Saved! Property valuations now displaying in {selectedCountry} currency.</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#755a24] transition-all cursor-pointer"
              >
                Save Country &amp; Valuation Preferences
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
