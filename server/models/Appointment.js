import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
