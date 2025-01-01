// Base cabin properties
interface BaseCabin {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
}

// For stored data in Supabase
export interface StoredCabin extends BaseCabin {
  id: number;
  created_at: string;
  image: string;
}

// For form submission
export interface CabinFormData extends BaseCabin {
  image: FileList;
}

// For API operations
export type Cabin = StoredCabin;

// Type guard
export const isStoredCabin = (cabin: unknown): cabin is StoredCabin => {
  if (typeof cabin !== 'object' || cabin === null) return false;
  return typeof (cabin as StoredCabin).image === 'string';
};