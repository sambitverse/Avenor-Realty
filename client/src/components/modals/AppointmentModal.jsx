import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { bookingApi } from '../../services/api';
import { X, Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react';

export default function AppointmentModal() {
  const { isAppointmentOpen, closeBookingModal, appointmentProperty, addAppointment, user } = useApp();
  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('11:00 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isAppointmentOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newApp = {
      id: `v-${Date.now()}`,
      propertyId: appointmentProperty?.id || 'prop-101',
      propertyTitle: appointmentProperty?.title || 'General Architectural Consultation',
      location: appointmentProperty?.location || 'Alibaug, Maharashtra',
      image: appointmentProperty?.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      clientName: name || user?.name || 'Client',
      clientEmail: user?.email || 'client@avenor.com',
      clientPhone: phone || '+91 98765 43210',
      date,
      time,
      status: 'Pending Approval'
    };

    addAppointment(newApp);

    await bookingApi.createBooking({
      propertyId: appointmentProperty?.id || 'general',
      propertyTitle: appointmentProperty?.title || 'General Architectural Consultation',
      date,
      time,
      clientName: name,
      clientPhone: phone
    });

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      closeBookingModal();
    }, 2500);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBookingModal();
      }}
      className="fixed inset-0 z-[160] bg-[#181818]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#F7F5F2] border border-[#E8E5DF] p-8 rounded-3xl shadow-2xl relative text-[#111111]"
      >
        <button 
          onClick={closeBookingModal}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-black text-white hover:bg-[#755a24] transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-mono text-[#C9A86A] uppercase tracking-widest block mb-1">
            Private Inspection Scheduler
          </span>
          <h3 className="font-serif text-3xl font-normal text-[#111111]">
            Schedule Private Visit
          </h3>
          {appointmentProperty && (
            <p className="text-xs font-serif italic text-[#C9A86A] mt-1">
              Target: {appointmentProperty.title} ({appointmentProperty.location})
            </p>
          )}
        </div>

        {confirmed ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-14 h-14 text-[#C9A86A] mx-auto" />
            <h4 className="font-serif text-2xl text-[#111111]">Visit Confirmed</h4>
            <p className="text-xs text-[#111111]/70 max-w-sm mx-auto">
              Your appointment for <span className="font-bold">{date}</span> at <span className="font-bold">{time}</span> has been confirmed with Senior Partner Marcus Vance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-[#111111]/60 uppercase tracking-widest block mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#111111]/60 uppercase tracking-widest block mb-1">Preferred Time Slot</label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none cursor-pointer"
                >
                  <option value="10:00 AM">10:00 AM Morning Slot</option>
                  <option value="11:30 AM">11:30 AM Morning Slot</option>
                  <option value="03:00 PM">03:00 PM Afternoon Slot</option>
                  <option value="05:30 PM">05:30 PM Sunset View Slot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#111111]/60 uppercase tracking-widest block mb-1">Your Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alexander Wright"
                className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#111111]/60 uppercase tracking-widest block mb-1">Phone / WhatsApp Number</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 11223"
                className="w-full bg-white border border-[#E8E5DF] rounded-xl px-4 py-2.5 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#111111] text-[#F7F5F2] hover:bg-[#C9A86A] hover:text-[#181818] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Confirm Private Visit Reservation
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
