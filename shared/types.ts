export type UserRole = 'Guest' | 'User' | 'Admin' | 'Property Owner' | 'Agent';

export type PropertyPurpose = 'Buy' | 'Rent' | 'Lease';

export type PropertyCategory = 
  | 'Luxury Villas' 
  | 'Penthouses' 
  | 'Sky Apartments' 
  | 'Farm Houses' 
  | 'Commercial' 
  | 'Studio' 
  | 'Land';

export type PropertyStatus = 'Active' | 'Sold' | 'Rented' | 'Archived';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  favorites?: string[];
  recentlyViewed?: string[];
  createdAt?: string;
}

export interface IPropertyMetrics {
  investmentScore: number;
  rentalYield: string;
  roi5Year: string;
  crimeSafetyScore: number;
  energyRating: string;
  weather?: string;
}

export interface IPropertyTour360 {
  room: string;
  image: string;
  hotspot?: string;
}

export interface IProperty {
  _id: string;
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  purpose: PropertyPurpose;
  category: PropertyCategory;
  price: number;
  emi: number;
  location: string;
  city: string;
  country: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  builder: string;
  builderRating?: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  yearBuilt: number;
  possession: string;
  propertyStatus: PropertyStatus;
  approvalStatus: ApprovalStatus;
  isFeatured: boolean;
  isLuxury: boolean;
  tags: string[];
  heroVideo?: string;
  images: string[];
  tour360?: IPropertyTour360[];
  floorPlan?: string;
  amenities: string[];
  metrics: IPropertyMetrics;
  nearbyPlaces?: Array<{ name: string; distance: string; type: string }>;
  priceHistory?: Array<{ year: string; price: number }>;
  owner?: { name: string; role: string; phone: string; email: string };
  createdAt?: string;
}

export interface IAppointment {
  _id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface IReview {
  _id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
