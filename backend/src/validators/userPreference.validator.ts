import { z } from 'zod';

const userPreferenceSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string(),
  listingType: z.enum(['RENT', 'SHARED']),
  location: z.array(z.string()),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
  propertyType: z.string(),
  minLease: z.number().int().positive(),
  maxLease: z.number().int().positive(),
  facilities: z.array(z.string()),
  minBedrooms: z.number().int().positive().optional(),
  maxBedrooms: z.number().int().positive().optional(),
  roomType: z.string().optional(),
  suitability: z.string().optional(),
  minHousemates: z.number().int().positive().optional(),
  maxHousemates: z.number().int().positive().optional(),
  ownerOccupied: z.boolean().optional(),
  keywords: z.string().optional(),
  customMessage: z.string(),
  endDate: z.string().or(z.date())
});

export function validateUserPreference(data: any) {
  // Transform the data to match Prisma schema
  return {
    userId: data.userId || 'default', // Add required field
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    listingType: data.listingType,
    location: data.location,
    propertyType: data.propertyType,
    priceRange: data.priceRange,
    minBedrooms: data.rentDetails?.minBedrooms,
    maxBedrooms: data.rentDetails?.maxBedrooms,
    message: data.message,
    endDate: new Date(data.endDate)
  };
} 