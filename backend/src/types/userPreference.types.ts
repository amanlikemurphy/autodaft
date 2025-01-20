export interface UserPreference {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Search Preferences
  listingType: 'rent' | 'shared';
  location: string;
  propertyType: string;
  priceRange: number;
  minBedrooms?: number;  // Optional but directly on the model
  maxBedrooms?: number;
  
  // Additional Details
  rentDetails?: Record<string, unknown>;    // For future extensibility
  sharedDetails?: Record<string, unknown>;  // For future extensibility
  
  // Common Fields
  message: string;
  endDate: Date;
} 