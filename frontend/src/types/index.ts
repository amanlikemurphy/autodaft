// Form Types
export interface FormValues {
    listingType: 'rent' | 'shared';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    propertyType: string;
    priceRange: number;
    rentDetails?: {
        minBedrooms?: string;
        maxBedrooms?: string;
    };
    sharedDetails?: Record<string, unknown>;
    message: string;
    endDate: Date;
}

// Component Props Types
export interface FormFieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
    required?: boolean;
}

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
} 