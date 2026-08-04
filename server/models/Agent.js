import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roleTitle: { type: String, default: 'Senior Partner' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String, default: '' },
  rating: { type: Number, default: 4.9 },
  experienceYears: { type: String, default: '15 Years' }
}, { timestamps: true });

export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
