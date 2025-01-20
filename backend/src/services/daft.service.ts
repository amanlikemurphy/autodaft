import axios from 'axios';

interface ListingParams {
    location: string;
    min_price: string;
    max_price: string;
    property_type: string;
    bedrooms_min: string;
    bedrooms_max: string;
    search_type: string;
}

export async function fetchListings(params: ListingParams) {
    try {
        const response = await axios.get('http://localhost:8000/listings', {
            params: {
                location: params.location,
                min_price: params.min_price,
                max_price: params.max_price,
                property_type: params.property_type,
                bedrooms_min: params.bedrooms_min,
                bedrooms_max: params.bedrooms_max,
                search_type: params.search_type
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
} 