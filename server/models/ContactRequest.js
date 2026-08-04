import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  interest: { type: String, default: 'Buying' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['New', 'InContact', 'Resolved'], default: 'New' }
}, { timestamps: true });

export const ContactRequest = mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema);
