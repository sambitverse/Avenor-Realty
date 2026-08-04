import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
  purpose: { type: String, enum: ['Buy', 'Rent', 'Lease'], default: 'Buy' },
  category: { 
    type: String, 
    enum: ['Luxury Villas', 'Penthouses', 'Sky Apartments', 'Farm Houses', 'Commercial', 'Studio', 'Land'], 
    default: 'Luxury Villas' 
  },
  price: { type: Number, required: true },
  emi: { type: Number, default: 0 },
  location: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: 'India' },
  address: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: 18.6414 },
    lng: { type: Number, default: 72.8722 }
  },
  builder: { type: String, default: 'Avenor Signature Developments' },
  builderRating: { type: Number, default: 4.9 },
  bedrooms: { type: Number, default: 4 },
  bathrooms: { type: Number, default: 4 },
  parking: { type: Number, default: 2 },
  area: { type: Number, required: true }, // sqft
  yearBuilt: { type: Number, default: 2024 },
  possession: { type: String, default: 'Ready to Move' },
  propertyStatus: { type: String, enum: ['Active', 'Sold', 'Rented', 'Archived'], default: 'Active' },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
  isFeatured: { type: Boolean, default: true },
  isLuxury: { type: Boolean, default: true },
  tags: [{ type: String }],
  heroVideo: { type: String, default: '/video.mp4' },
  images: [{ type: String }],
  tour360: [{
    room: String,
    image: String,
    hotspot: String
  }],
  floorPlan: { type: String, default: '' },
  amenities: [{ type: String }],
  metrics: {
    investmentScore: { type: Number, default: 94 },
    rentalYield: { type: String, default: '6.8%' },
    roi5Year: { type: String, default: '42%' },
    crimeSafetyScore: { type: Number, default: 98 },
    energyRating: { type: String, default: 'A++' },
    weather: { type: String, default: '27°C Coastal Breeze' }
  },
  nearbyPlaces: [{
    name: String,
    distance: String,
    type: { type: String }
  }],
  priceHistory: [{
    year: String,
    price: Number
  }],
  owner: {
    name: String,
    role: String,
    phone: String,
    email: String
  }
}, { timestamps: true });

export const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
