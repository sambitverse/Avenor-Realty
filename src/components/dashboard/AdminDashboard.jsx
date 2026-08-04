import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Edit3, Search, X, Check, ArrowUpRight, Phone, Mail, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { formatPropertyPrice } from '../../utils/currencyHelper';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    properties, 
    addProperty, 
    updateProperty, 
    deleteProperty, 
    appointments,
    updateAppointmentStatus,
    user,
    logout 
  } = useApp();

  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard' | 'analytics' | 'properties' | 'builders' | 'appointments'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-36 bg-[#F7F5F2] text-[#111111] text-center p-8">
        <h2 className="font-serif text-3xl font-bold mb-4">Avenor Admin Portal Access Required</h2>
        <p className="text-xs font-mono text-[#858383] mb-6">This section is strictly reserved for Avenor Admin Principals.</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold cursor-pointer">
          Return to Main Portal
        </button>
      </div>
    );
  }

  // Real client appointments filtered by approval status
  const pendingAppointments = appointments.filter(a => a.status === 'Pending Approval');
  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed' || !a.status);

  // Partner Builders Mock Data
  const [builders] = useState([
    { id: 'b-1', name: 'Kengo Studio', projects: 12, location: 'Tokyo / Bali', specialty: 'Organic Timber' },
    { id: 'b-2', name: 'ArchiCore', projects: 8, location: 'Zurich / Mumbai', specialty: 'Monolithic Travertine' },
    { id: 'b-3', name: 'SANAA Partners', projects: 15, location: 'Kyoto / London', specialty: 'Glass Canopy' },
    { id: 'b-4', name: 'Studio Mumbai', projects: 9, location: 'Alibaug', specialty: 'Coastal Sanctuaries' }
  ]);

  // Add Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    subtitle: 'Architectural Residence',
    description: 'Modern luxury architectural estate with organic Japanese & Scandinavian design elements.',
    purpose: 'Buy',
    category: 'Luxury Villas',
    price: 24800000,
    location: 'Ubud, Bali',
    city: 'Ubud',
    country: 'Indonesia',
    area: 4250,
    bedrooms: 4,
    bathrooms: 4,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85']
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newProp.title) {
      alert("Please enter a property title.");
      return;
    }
    const propToInsert = {
      ...newProp,
      id: `prop-${Date.now()}`,
      price: Number(newProp.price),
      bedrooms: Number(newProp.bedrooms),
      bathrooms: Number(newProp.bathrooms),
      area: Number(newProp.area)
    };
    await addProperty(propToInsert);
    setIsAddModalOpen(false);
    alert(`Listing "${newProp.title}" Created & Published Successfully!`);
  };

  const handleApproveInspection = (id, clientName) => {
    updateAppointmentStatus(id, 'Confirmed');
    alert(`Inspection request for ${clientName} approved and added to Scheduled Inspections!`);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete property listing "${title}"?`)) {
      await deleteProperty(id);
    }
  };

  const filteredProperties = properties.filter(p => 
    !searchQuery || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex bg-[#fdf8f8] text-[#1c1b1b] overflow-hidden pt-20 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 h-full flex flex-col bg-white/70 backdrop-blur-2xl border-r border-[#c4c7c7]/20 p-8 shrink-0">
        <div className="mb-12">
          <span className="font-sans text-4xl font-bold tracking-tighter text-black block">Avenor</span>
          <p className="font-mono text-[10px] text-[#858383] uppercase tracking-[0.1em] mt-1 font-semibold opacity-60">Management Portal</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          <div className="font-mono text-[10px] text-[#858383]/60 uppercase tracking-[0.2em] font-semibold mb-4">OVERVIEW</div>
          
          <button 
            onClick={() => setActiveNav('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === 'dashboard' ? 'bg-black text-white font-medium shadow-md' : 'text-[#444748] hover:bg-[#f1edec]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveNav('analytics')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === 'analytics' ? 'bg-black text-white font-medium shadow-md' : 'text-[#444748] hover:bg-[#f1edec]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span className="text-sm font-medium">Analytics</span>
          </button>

          <div className="pt-8 font-mono text-[10px] text-[#858383]/60 uppercase tracking-[0.2em] font-semibold mb-4">MANAGEMENT</div>
          
          <button 
            onClick={() => setActiveNav('properties')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === 'properties' ? 'bg-black text-white font-medium shadow-md' : 'text-[#444748] hover:bg-[#f1edec]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">domain</span>
            <span className="text-sm font-medium">Properties ({properties.length})</span>
          </button>

          <button 
            onClick={() => setActiveNav('builders')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === 'builders' ? 'bg-black text-white font-medium shadow-md' : 'text-[#444748] hover:bg-[#f1edec]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">engineering</span>
            <span className="text-sm font-medium">Builders ({builders.length})</span>
          </button>

          <button 
            onClick={() => setActiveNav('appointments')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === 'appointments' ? 'bg-black text-white font-medium shadow-md' : 'text-[#444748] hover:bg-[#f1edec]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span className="text-sm font-medium">Appointments ({appointments.length})</span>
          </button>
        </nav>

        {/* User Profile Box */}
        <div className="mt-auto pt-8 border-t border-[#c4c7c7]/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white font-serif font-bold text-sm flex items-center justify-center border border-black/10">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-black">{user?.name || 'Admin Principal'}</p>
              <p className="font-mono text-[10px] text-[#858383] mt-1 uppercase">Admin Principal</p>
            </div>
          </div>

          <button 
            onClick={() => {
              logout();
              navigate('/');
            }} 
            className="font-mono text-[10px] text-red-600 font-bold uppercase hover:underline cursor-pointer"
          >
            Exit
          </button>
        </div>
      </aside>

      {/* Main Canvas Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-24 px-12 flex items-center justify-between z-40 bg-[#fdf8f8]/80 backdrop-blur-md">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black capitalize">
              {activeNav} <span className="font-serif italic font-normal text-black/40 ml-2">Management</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-[#f7f3f2] border border-[#c4c7c7]/20 rounded-full px-4 py-2 w-64">
              <span className="material-symbols-outlined text-[#858383] text-[20px] mr-2">search</span>
              <input 
                type="text"
                placeholder="Search data..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs text-black w-full placeholder:text-[#858383]"
              />
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-black text-white px-8 py-3 rounded-full flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Property</span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas Body */}
        <section className="flex-1 overflow-y-auto px-12 pb-12 no-scrollbar space-y-8">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeNav === 'dashboard' && (
            <div className="space-y-8">
              {/* Statistics Bento Grid */}
              <div className="grid grid-cols-12 gap-6 mt-4">
                {/* Portfolio Value Chart Box */}
                <div className="col-span-12 lg:col-span-7 p-8 rounded-xl bg-white/70 border border-[#c4c7c7]/20 backdrop-blur-md shadow-xs">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <p className="font-mono text-[10px] text-[#858383]/60 uppercase tracking-widest mb-1 font-semibold">Portfolio Value</p>
                      <h3 className="text-4xl font-bold text-black">$24.8M</h3>
                    </div>
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full font-mono text-xs font-bold border border-green-200">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      <span>+12.4%</span>
                    </div>
                  </div>

                  {/* Bar Visualization */}
                  <div className="h-48 flex items-end justify-between gap-4">
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '40%' }} />
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '60%' }} />
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '45%' }} />
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '85%' }} />
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '70%' }} />
                    <div className="flex-1 bg-black/5 hover:bg-black/10 transition-colors rounded-t-lg" style={{ height: '90%' }} />
                    <div className="flex-1 bg-black text-white rounded-t-lg" style={{ height: '100%' }} />
                  </div>
                  <div className="flex justify-between mt-4 font-mono text-[10px] text-[#858383]/40 uppercase tracking-widest font-semibold">
                    <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
                  <div className="p-8 rounded-xl bg-white/70 border border-[#c4c7c7]/20 backdrop-blur-md flex flex-col justify-between">
                    <span className="material-symbols-outlined text-black text-[32px] mb-4">group</span>
                    <div>
                      <p className="font-mono text-[10px] text-[#858383]/60 mb-1 font-semibold uppercase">Active Users</p>
                      <h4 className="text-3xl font-bold text-black">1,204</h4>
                    </div>
                  </div>

                  <div className="p-8 rounded-xl bg-white/70 border border-[#c4c7c7]/20 backdrop-blur-md flex flex-col justify-between">
                    <span className="material-symbols-outlined text-black text-[32px] mb-4">favorite</span>
                    <div>
                      <p className="font-mono text-[10px] text-[#858383]/60 mb-1 font-semibold uppercase">Total Likes</p>
                      <h4 className="text-3xl font-bold text-black">8.5k</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Management Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Real Client Pending Approvals */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-black">
                      Pending Client Requests ({pendingAppointments.length})
                    </h2>
                  </div>

                  <div className="bg-white/70 border border-[#c4c7c7]/20 rounded-xl overflow-hidden backdrop-blur-md p-4">
                    {pendingAppointments.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No pending client inspection requests.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingAppointments.map(app => (
                          <div key={app.id} className="p-4 rounded-xl bg-white border border-[#c4c7c7]/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <img src={app.image} alt={app.propertyTitle} className="w-12 h-12 rounded object-cover" />
                              <div>
                                <h4 className="font-semibold text-black text-sm">{app.propertyTitle}</h4>
                                <p className="text-xs text-[#858383] font-mono">Client: {app.clientName} ({app.clientPhone})</p>
                                <p className="text-[10px] text-[#755a24] font-mono font-bold">{app.date} at {app.time}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleApproveInspection(app.id, app.clientName)}
                              className="font-mono text-[10px] uppercase font-bold px-4 py-2 bg-black text-white rounded-full hover:bg-[#755a24] transition-all cursor-pointer"
                            >
                              Approve &amp; Schedule
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirmed Scheduled Inspections */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-black">
                      Scheduled Inspections ({confirmedAppointments.length})
                    </h2>
                    <button onClick={() => setActiveNav('appointments')} className="font-mono text-xs text-black hover:underline uppercase font-bold cursor-pointer">
                      Manage Calendar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {confirmedAppointments.length === 0 ? (
                      <div className="py-12 text-center bg-white/70 border border-[#c4c7c7]/20 rounded-xl">
                        <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No confirmed scheduled inspections.</p>
                      </div>
                    ) : (
                      confirmedAppointments.slice(0, 4).map(app => (
                        <div key={app.id} className="bg-white/70 border border-[#c4c7c7]/20 p-4 rounded-xl flex items-center justify-between backdrop-blur-md">
                          <div className="flex gap-4 items-center">
                            <img src={app.image} alt={app.propertyTitle} className="w-12 h-12 rounded object-cover border border-[#c4c7c7]/20" />
                            <div>
                              <h4 className="font-semibold text-black text-sm">{app.propertyTitle}</h4>
                              <p className="text-xs text-[#444748] font-mono">Lead: {app.clientName} ({app.date})</p>
                            </div>
                          </div>

                          <span className="font-mono text-[10px] uppercase font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-300">
                            Confirmed
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS PANEL */}
          {activeNav === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 p-6 rounded-2xl border border-[#c4c7c7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest block font-bold">TOTAL PORTFOLIO VOLUME</span>
                  <h3 className="text-3xl font-bold text-black mt-2">₹1,480 Cr</h3>
                  <p className="text-xs text-green-700 font-mono mt-1 font-bold">+18.2% vs last quarter</p>
                </div>

                <div className="bg-white/70 p-6 rounded-2xl border border-[#c4c7c7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest block font-bold">AVG TIME ON MARKET</span>
                  <h3 className="text-3xl font-bold text-black mt-2">14 Days</h3>
                  <p className="text-xs text-green-700 font-mono mt-1 font-bold">4.2 days faster than benchmark</p>
                </div>

                <div className="bg-white/70 p-6 rounded-2xl border border-[#c4c7c7]/20 backdrop-blur-md">
                  <span className="font-mono text-[10px] text-[#858383] uppercase tracking-widest block font-bold">INSPECTION CONVERSION</span>
                  <h3 className="text-3xl font-bold text-black mt-2">42.8%</h3>
                  <p className="text-xs text-green-700 font-mono mt-1 font-bold">+5.4% high-net-worth lead rate</p>
                </div>
              </div>

              {/* Regional Demand Breakdown */}
              <div className="bg-white/70 p-8 rounded-2xl border border-[#c4c7c7]/20 backdrop-blur-md space-y-6">
                <h3 className="text-2xl font-bold text-black">Regional HNI Demand Distribution</h3>
                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1 font-bold">
                      <span>Alibaug &amp; Coastal Maharashtra</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-[#f1edec] h-3 rounded-full overflow-hidden">
                      <div className="bg-black h-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-bold">
                      <span>Ubud &amp; Bali Cliffside</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full bg-[#f1edec] h-3 rounded-full overflow-hidden">
                      <div className="bg-[#755a24] h-full" style={{ width: '30%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-bold">
                      <span>Kyoto Modern Estates</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-[#f1edec] h-3 rounded-full overflow-hidden">
                      <div className="bg-gray-400 h-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROPERTIES MANAGEMENT PANEL */}
          {activeNav === 'properties' && (
            <div className="bg-white/70 border border-[#c4c7c7]/20 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-[#c4c7c7]/20 flex justify-between items-center">
                <h3 className="text-xl font-bold text-black">Active Residence Inventory</h3>
                <span className="font-mono text-xs text-[#858383] uppercase tracking-widest font-bold">{filteredProperties.length} Active Listings</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f7f3f2] border-b border-[#c4c7c7]/10 font-mono text-[10px] text-[#858383]/60 uppercase tracking-widest">
                    <tr>
                      <th className="p-4">Listing Title</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Valuation</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c7c7]/10 font-sans text-xs">
                    {filteredProperties.map(p => (
                      <tr key={p.id} className="hover:bg-[#f7f3f2]/50 transition-colors">
                        <td className="p-4 font-bold text-black flex items-center gap-3">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded object-cover border border-[#c4c7c7]/20" />
                          <span>{p.title}</span>
                        </td>
                        <td className="p-4 text-[#444748]">{p.location}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-[#f1edec] text-black font-mono text-[10px] font-bold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#755a24]">
                          {formatPropertyPrice(p.price, 'India', p.purpose || 'Buy')}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BUILDERS DIRECTORY PANEL */}
          {activeNav === 'builders' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {builders.map(b => (
                <div key={b.id} className="bg-white/70 p-6 rounded-2xl border border-[#c4c7c7]/20 backdrop-blur-md flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-[#755a24] uppercase tracking-widest font-bold">{b.specialty}</span>
                    <h3 className="font-serif text-2xl font-bold text-black">{b.name}</h3>
                    <p className="text-xs text-[#858383] font-mono">{b.location}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-2xl font-bold text-black block">{b.projects}</span>
                    <span className="text-[10px] text-[#858383] uppercase font-bold">PROJECTS</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: APPOINTMENTS & INSPECTIONS PANEL */}
          {activeNav === 'appointments' && (
            <div className="space-y-8">
              {/* Section 1: Pending Client Approval Requests */}
              <div className="bg-white/70 border border-[#c4c7c7]/20 rounded-2xl p-8 backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#c4c7c7]/20">
                  <div>
                    <h3 className="text-2xl font-bold text-black">Pending Client Approval Requests</h3>
                    <p className="text-xs text-[#858383] font-mono mt-1">Inspection booking requests submitted by clients requiring Admin confirmation.</p>
                  </div>
                  <span className="bg-[#ffdb99] text-[#795f28] font-mono text-xs font-bold px-3 py-1 rounded-full">
                    {pendingAppointments.length} Pending
                  </span>
                </div>

                {pendingAppointments.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-xs font-mono text-[#858383] uppercase tracking-widest">No pending inspection requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAppointments.map(app => (
                      <div key={app.id} className="bg-white p-6 rounded-2xl border border-[#c4c7c7]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                        <div className="flex gap-4 items-center">
                          <img src={app.image} alt={app.propertyTitle} className="w-16 h-16 rounded-xl object-cover border border-[#c4c7c7]/20" />
                          <div className="space-y-1">
                            <h4 className="font-serif text-lg font-bold text-black">{app.propertyTitle}</h4>
                            <p className="text-xs text-[#858383] font-mono flex items-center gap-3">
                              <span>{app.location}</span>
                              <span>•</span>
                              <span className="text-[#755a24] font-bold">{app.date} at {app.time}</span>
                            </p>
                            <p className="text-xs text-black font-sans font-semibold">
                              Client: {app.clientName} ({app.clientEmail} | {app.clientPhone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleApproveInspection(app.id, app.clientName)}
                            className="px-6 py-2.5 rounded-full bg-black text-white font-mono text-xs uppercase font-bold hover:bg-[#755a24] transition-all cursor-pointer shadow-md"
                          >
                            Approve &amp; Schedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Confirmed Scheduled Inspections */}
              <div className="bg-white/70 border border-[#c4c7c7]/20 rounded-2xl p-8 backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#c4c7c7]/20">
                  <div>
                    <h3 className="text-2xl font-bold text-black">Confirmed Scheduled Inspections</h3>
                    <p className="text-xs text-[#858383] font-mono mt-1">Active confirmed inspection calendar.</p>
                  </div>
                  <span className="bg-green-100 text-green-800 border border-green-300 font-mono text-xs font-bold px-3 py-1 rounded-full">
                    {confirmedAppointments.length} Confirmed
                  </span>
                </div>

                <div className="space-y-4">
                  {confirmedAppointments.map(app => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-[#c4c7c7]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4 items-center">
                        <img src={app.image} alt={app.propertyTitle} className="w-16 h-16 rounded-xl object-cover border border-[#c4c7c7]/20" />
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-black">{app.propertyTitle}</h4>
                          <p className="text-xs text-[#858383] font-mono flex items-center gap-3">
                            <span>{app.location}</span>
                            <span>•</span>
                            <span className="text-[#755a24] font-bold">{app.date} at {app.time}</span>
                          </p>
                          <p className="text-xs text-black font-sans font-semibold">
                            Client: {app.clientName} ({app.clientEmail} | {app.clientPhone})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-300">
                          Confirmed
                        </span>
                        <button 
                          onClick={() => alert(`Contacting ${app.clientName} at ${app.clientPhone}...`)}
                          className="px-4 py-2 rounded-full border border-black font-mono text-[10px] uppercase font-bold hover:bg-black hover:text-white transition-all cursor-pointer"
                        >
                          Contact Client
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* --- ADD PROPERTY MODAL --- */}
      {isAddModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl border border-[#c4c7c7] relative space-y-6 text-black"
          >
            <div className="flex justify-between items-center pb-4 border-b border-[#e5e2e1]">
              <h3 className="text-2xl font-bold">Add Property Listing</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 font-sans text-xs">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#858383] block mb-1">Listing Title</label>
                <input 
                  type="text" 
                  required
                  value={newProp.title}
                  onChange={e => setNewProp({ ...newProp, title: e.target.value })}
                  placeholder="e.g. Eco-Villa Ubud"
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] focus:outline-none font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] font-bold uppercase text-[#858383] block mb-1">Category</label>
                  <select 
                    value={newProp.category}
                    onChange={e => setNewProp({ ...newProp, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] focus:outline-none font-semibold"
                  >
                    <option value="Luxury Villas">Luxury Villas</option>
                    <option value="Penthouses">Penthouses</option>
                    <option value="Architectural Showcases">Architectural Showcases</option>
                    <option value="Heritage Estates">Heritage Estates</option>
                    <option value="Chalets">Chalets</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] font-bold uppercase text-[#858383] block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newProp.price}
                    onChange={e => setNewProp({ ...newProp, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#858383] block mb-1">Location</label>
                <input 
                  type="text" 
                  value={newProp.location}
                  onChange={e => setNewProp({ ...newProp, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#c4c7c7] focus:outline-none font-semibold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-full border border-black font-mono text-xs uppercase font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-8 py-3 rounded-full bg-black text-white font-mono text-xs uppercase font-bold hover:bg-[#755a24] cursor-pointer">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
