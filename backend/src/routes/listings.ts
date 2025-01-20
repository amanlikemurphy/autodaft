import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

// Define the expected query parameters as a TypeScript interface
interface ListingsQueryParams {
    location: string;
    min_price: string;
    max_price: string;
    property_type: string;
    bedrooms_min: string;
    bedrooms_max: string;
    search_type: 'rent' | 'sharing';
    min_lease?: string;
    max_lease?: string;
    facilities?: string[];
    suitability?: 'male' | 'female' | 'any';
    owner_occupied?: boolean;
    min_tenants?: string;
    max_tenants?: string;
}

// Define the expected structure of the response from the Python microservice
interface Listing {
    title: string;
    price: string;
    url: string;
    bedrooms: number;
    propertyType?: string;
    address?: string;
    facilities?: string[];
    lease_length?: number;
    suitability?: 'male' | 'female' | 'any';
    owner_occupied?: boolean;
}

router.get("/listings", async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            location, 
            min_price, 
            max_price, 
            property_type, 
            bedrooms_min, 
            bedrooms_max,
            search_type = 'rent',  // Default to rent
            min_lease,
            max_lease,
            facilities,
            suitability,
            owner_occupied,
            min_tenants,
            max_tenants
        } = req.query as unknown as ListingsQueryParams;

        if (!location || !min_price || !max_price || !property_type || !bedrooms_min || !bedrooms_max) {
            return res.status(400).json({ error: "All query parameters are required." });
        }

        // Forward the query parameters to the Python microservice
        const pythonServiceUrl = "http://localhost:8000/listings";
        const response = await axios.get<Listing[]>(pythonServiceUrl, {
            params: {
                location,
                min_price,
                max_price,
                property_type,
                bedrooms_min,
                bedrooms_max,
                search_type,
                min_lease,
                max_lease,
                facilities,
                suitability,
                owner_occupied,
                min_tenants,
                max_tenants
            },
        });

        // Send the Python microservice response back to the frontend
        res.json(response.data);  // Forward the entire response
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings." });
    }
});

export { router as listingsRouter };
