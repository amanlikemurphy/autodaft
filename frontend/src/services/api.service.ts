import axios from 'axios';
import { FormValues } from '../types';

const API_URL = 'http://localhost:3000/api';

export async function submitPreferences(formData: FormValues) {
    try {
        const response = await axios.post(`${API_URL}/preferences`, {
            ...formData,
            // Convert price range values to match API expectations
            min_price: formData.minPrice,
            max_price: formData.maxPrice
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting preferences:', error);
        throw error;
    }
} 