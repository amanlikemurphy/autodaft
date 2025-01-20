import { PrismaClient, UserPreference } from '@prisma/client';
import { fetchListings } from './daft.service';
import { sendEmail } from './email.service';
import * as cron from 'node-cron';

const prisma = new PrismaClient();

interface MatchedListing {
    title: string;
    price: string;
    url: string;
    bedrooms: number;
    propertyType?: string;
    address?: string;
}

export async function startAutomationService() {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        try {
            // Get all active user preferences
            const activePreferences = await prisma.userPreference.findMany({
                where: {
                    endDate: {
                        gt: new Date() // Only get preferences that haven't expired
                    }
                }
            });

            for (const preference of activePreferences) {
                // Fetch matching listings
                const listings = await fetchListings({
                    location: preference.location,
                    min_price: preference.minPrice.toString(),
                    max_price: preference.maxPrice.toString(),
                    property_type: preference.propertyType,
                    bedrooms_min: preference.minBedrooms?.toString() || '1',
                    bedrooms_max: preference.maxBedrooms?.toString() || '3',
                    search_type: preference.listingType
                });

                // Process each listing
                for (const listing of listings.data) {
                    // Check if we've already applied to this property
                    const existingApplication = await prisma.propertyApplication.findUnique({
                        where: {
                            propertyReference_preferenceId: {
                                propertyReference: listing.url,
                                preferenceId: preference.id
                            }
                        }
                    });

                    if (!existingApplication) {
                        // Record the application
                        await prisma.propertyApplication.create({
                            data: {
                                propertyReference: listing.url,
                                preferenceId: preference.id
                            }
                        });

                        // Send email notification
                        await sendEmail({
                            to: preference.email,
                            subject: `New Property Application: ${listing.title}`,
                            html: `
                                <h2>We've applied to a property matching your criteria!</h2>
                                <p>Property: ${listing.title}</p>
                                <p>Price: ${listing.price}</p>
                                <p>Location: ${listing.address || 'Not specified'}</p>
                                <p>View the property: <a href="${listing.url}">Click here</a></p>
                            `
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Automation service error:', error);
        }
    });

    // Cleanup expired preferences daily at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            await prisma.userPreference.deleteMany({
                where: {
                    endDate: {
                        lt: new Date()
                    }
                }
            });
        } catch (error) {
            console.error('Cleanup service error:', error);
        }
    });
}

export async function scheduleAutomation(userPreference: UserPreference) {
    try {
        // Schedule the automation task
        // This will be called when a new preference is created
        console.log('Scheduling automation for user preference:', userPreference.id);
        // Add your scheduling logic here
    } catch (error) {
        console.error('Error scheduling automation:', error);
        throw error;
    }
} 