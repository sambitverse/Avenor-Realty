import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Globe, RefreshCw } from 'lucide-react';
import { COUNTRY_CURRENCIES } from '../../utils/currencyHelper';

export default function AuthModal() {
  const navigate = useNavigate();
  const { isAuthOpen, closeAuthModal, setUser, authMode } = useApp();
  const [mode, setMode] = useState(authMode || 'login'); // 'login' | 'signup' | 'otp'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('user');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [generatedOtp, setGeneratedOtp] = useState('4819');
  const [otpError, setOtpError] = useState('');

  const countriesList = Object.keys(COUNTRY_CURRENCIES);

  useEffect(() => {
    if (authMode) setMode(authMode);
    setOtpError('');
  }, [authMode, isAuthOpen]);

  if (!isAuthOpen) return null;

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Generate new random 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtp('');
    setOtpError('');
    setMode('otp');
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp !== generatedOtp && otp !== '4819') {
      setOtpError(`Invalid code. Use verification code: ${generatedOtp}`);
      return;
    }

    const isUserAdmin = role === 'admin' || email.toLowerCase().includes('admin');
    const displayName = name ? name : (email ? email.split('@')[0] : (isUserAdmin ? 'Julian Vane' : 'Alexander Wright'));

    const newUserObj = {
      name: displayName,
      email: email || (isUserAdmin ? 'admin@avenor.com' : 'investor@avenor.com'),
      role: isUserAdmin ? 'admin' : 'user',
      preferredCountry: mode === 'signup' ? selectedCountry : 'India'
    };

    setUser(newUserObj, mode === 'signup');
    closeAuthModal();

    // Redirect user according to role
    if (isUserAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-[160] bg-[#181818]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#242424] border border-[#333333] p-8 rounded-3xl shadow-2xl relative text-[#F7F5F2]"
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#C9A86A] text-[#C9A86A] flex items-center justify-center font-serif font-bold text-xl mx-auto mb-3">
            A
          </div>
          <h3 className="font-serif text-2xl text-white">
            {mode === 'login' ? 'Private Client Access' : mode === 'signup' ? 'Create HNI Portfolio' : 'Security OTP Verification'}
          </h3>
          <p className="text-xs font-mono text-[#C9A86A] uppercase tracking-widest mt-1">
            {mode === 'otp' ? `Code sent to ${email}` : 'Confidential Real Estate Portal'}
          </p>
        </div>

        {mode !== 'otp' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            
            {/* Full Name (Signup Only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">Full Name</label>
                <div className="flex items-center bg-[#181818] border border-[#333333] rounded-xl px-3 py-2.5">
                  <User className="w-4 h-4 text-[#C9A86A] mr-2" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sambit Moharana" 
                    className="bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none w-full"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">Email Address</label>
              <div className="flex items-center bg-[#181818] border border-[#333333] rounded-xl px-3 py-2.5">
                <Mail className="w-4 h-4 text-[#C9A86A] mr-2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. client@avenor.com" 
                  className="bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">Password</label>
              <div className="flex items-center bg-[#181818] border border-[#333333] rounded-xl px-3 py-2.5">
                <Lock className="w-4 h-4 text-[#C9A86A] mr-2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="bg-transparent border-none text-xs text-white placeholder-white/30 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Account Type Selection */}
            <div>
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">Account Type</label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-[#181818] border border-[#333333] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="user">HNI Client / Investor Account</option>
                <option value="admin">Avenor Admin Principal</option>
              </select>
            </div>

            {/* Preferred Valuation Country (Signup Only) */}
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-1">Preferred Currency Country</label>
                <div className="flex items-center bg-[#181818] border border-[#333333] rounded-xl px-3 py-2.5">
                  <Globe className="w-4 h-4 text-[#C9A86A] mr-2" />
                  <select 
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                    className="bg-transparent border-none text-xs text-white focus:outline-none w-full cursor-pointer"
                  >
                    {countriesList.map(c => (
                      <option key={c} value={c} className="bg-[#181818] text-white">
                        {c} ({COUNTRY_CURRENCIES[c].symbol} {COUNTRY_CURRENCIES[c].code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#C9A86A] text-[#181818] py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-all shadow-lg mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Authenticate & Access' : 'Create HNI Portfolio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mode Switcher */}
            <div className="text-center pt-4 border-t border-white/10 text-xs text-white/60">
              {mode === 'login' ? (
                <p>
                  New HNI Investor?{' '}
                  <button 
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[#C9A86A] font-bold hover:underline cursor-pointer"
                  >
                    Create Portfolio
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#C9A86A] font-bold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        ) : (
          /* OTP Screen */
          <form onSubmit={handleOtpVerify} className="space-y-6 text-center">
            <div className="bg-[#181818] p-4 rounded-2xl border border-[#333333] space-y-2">
              <div className="flex justify-center items-center gap-2 text-xs font-mono text-[#C9A86A]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Code Sent:</span>
              </div>
              <div className="font-mono text-3xl font-bold tracking-[0.25em] text-white py-1">
                {generatedOtp}
              </div>
              <p className="text-[10px] text-white/40">Enter code below to complete secure authentication.</p>
            </div>

            <div>
              <input 
                type="text"
                maxLength={4}
                required
                autoFocus
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="0000"
                className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-[#181818] border border-[#333333] rounded-2xl py-3 text-white focus:outline-none focus:border-[#C9A86A]"
              />
              {otpError && (
                <p className="text-xs text-red-400 font-mono mt-2">{otpError}</p>
              )}
            </div>

            <div className="space-y-3">
              <button 
                type="submit"
                className="w-full bg-[#C9A86A] text-[#181818] py-3.5 rounded-xl font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-all shadow-lg cursor-pointer"
              >
                Verify &amp; Enter Portal
              </button>

              <button 
                type="button"
                onClick={() => {
                  const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                  setGeneratedOtp(newOtp);
                }}
                className="text-xs font-mono text-white/50 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
