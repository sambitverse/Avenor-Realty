import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Home, Layers, User, ShieldCheck, Menu, X, LogOut, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, logout, openAuthModal, openBookingModal } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-6 left-0 right-0 w-full z-[100] px-6 sm:px-12 pointer-events-none">
      
      {/* See-Through Floating Container */}
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        
        {/* Left Container: AVENOR Wordmark + Properties, Projects, Company Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group select-none">
            <span className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tighter text-black leading-none uppercase drop-shadow-sm">
              AVENOR
            </span>
          </Link>

          {/* Left Navigation Links (Near AVENOR) */}
          <nav className="hidden md:flex items-center gap-2 font-sans text-xs">
            
            <Link 
              to="/properties" 
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                isActive('/properties') 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-black/10 text-black border border-black/10 hover:bg-black hover:text-white backdrop-blur-md'
              }`}
            >
              Properties
            </Link>

            <Link 
              to="/projects" 
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                isActive('/projects') 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-black/10 text-black border border-black/10 hover:bg-black hover:text-white backdrop-blur-md'
              }`}
            >
              Projects
            </Link>

            <Link 
              to="/about" 
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                isActive('/about') || isActive('/company')
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-black/10 text-black border border-black/10 hover:bg-black hover:text-white backdrop-blur-md'
              }`}
            >
              Company
            </Link>

            {/* Admin link visible ONLY if logged in as admin */}
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-5 py-2 rounded-full font-semibold transition-all ${
                  isActive('/admin') 
                    ? 'bg-black text-[#ffdb99] shadow-md font-bold' 
                    : 'bg-black/10 text-black border border-black/10 hover:bg-black hover:text-white backdrop-blur-md'
                }`}
              >
                Admin Panel
              </Link>
            )}

          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3 font-sans text-xs">
          
          {!user ? (
            <>
              {/* Log in Text Button */}
              <button 
                onClick={() => openAuthModal('login')}
                className="text-black font-bold px-3 py-2 hover:opacity-75 transition-opacity cursor-pointer"
              >
                Log in
              </button>

              {/* Sign up Pill Button */}
              <button 
                onClick={() => openAuthModal('signup')}
                className="bg-black text-white px-5 py-2 rounded-full font-semibold hover:bg-[#755a24] transition-all shadow-md cursor-pointer"
              >
                Sign up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Dashboard Badge (Initial Badge, NO Profile Photo) */}
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 bg-white/90 border border-black/20 px-3.5 py-1.5 rounded-full backdrop-blur-md hover:bg-black hover:text-white transition-all shadow-sm group"
                title="Profile & Currency Preferences"
              >
                <div className="w-5 h-5 rounded-full bg-black group-hover:bg-white text-white group-hover:text-black text-[10px] font-bold flex items-center justify-center font-serif">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="font-bold text-black group-hover:text-white">{user.name}</span>
                <span className="text-[10px] font-mono text-[#755a24] group-hover:text-[#ffdb99] font-bold px-1.5 py-0.5 rounded bg-[#f7f3f2] group-hover:bg-white/20">
                  {user.preferredCountry || 'India'}
                </span>
              </Link>

              {/* Post a Property Button (ADMIN ONLY) */}
              {user.role === 'admin' && (
                <button 
                  onClick={() => openBookingModal(null)}
                  className="border-2 border-black bg-black text-white px-5 py-2 rounded-full font-semibold hover:bg-[#755a24] transition-all shadow-md cursor-pointer"
                >
                  Post a property
                </button>
              )}

              <button 
                onClick={logout}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-black text-white shadow-lg cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-6 right-6 mt-4 bg-white/95 backdrop-blur-xl border border-black/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-3 font-sans text-xs font-semibold pointer-events-auto">
          <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-black/10 text-black">Properties</Link>
          <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-black/10 text-black">Projects</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-black/10 text-black">Company</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-black/10 text-[#755a24] font-bold">Admin Panel</Link>
          )}

          {user && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 border-b border-black/10 text-black flex items-center justify-between">
              <span>My Profile ({user.preferredCountry || 'India'})</span>
              <Globe className="w-4 h-4 text-[#755a24]" />
            </Link>
          )}

          {!user ? (
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-3 border border-black rounded-full text-center text-black font-bold cursor-pointer"
              >
                Log in
              </button>
              <button 
                onClick={() => { openAuthModal('signup'); setMobileMenuOpen(false); }}
                className="flex-1 py-3 bg-black text-white rounded-full text-center font-bold cursor-pointer"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {user.role === 'admin' && (
                <button 
                  onClick={() => { openBookingModal(null); setMobileMenuOpen(false); }}
                  className="w-full border-2 border-black bg-black text-white py-3 rounded-full font-semibold text-center cursor-pointer"
                >
                  Post a property
                </button>
              )}

              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-red-600 font-bold text-center cursor-pointer"
              >
                Log out ({user.name})
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
}
