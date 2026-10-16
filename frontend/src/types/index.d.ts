export interface FarmerProfile {
  name: string;
  location: string;
  farmArea: number;
  irrigationType: 'Borewell' | 'Canal' | 'Rainfed' | 'Drip';
}

export interface Crop {
  id: number;
  name: string;
  scientificName?: string;
  cropType?: string;
  duration?: string;
  durationDays?: number;
  waterRequirement?: string;
  description?: string;
  imageUrl?: string;
  suitabilityScore?: number; // Keep for frontend logic if needed
  reason?: string; // Keep for frontend logic if needed
}

export interface ToDoItem {
  id: string;
  category: 'Sowing' | 'Preparation' | 'Irrigation' | 'Fertilizer' | 'Pest' | 'Harvest';
  task: string;
  dueDate: string;
  completed: boolean;
}

export interface Scheme {
  id: number;
  name: string;
  description: string;
  eligibilityCriteria?: string;
  applicationLink?: string;
  deadline?: string;
  // Mapped fields for backward compatibility if needed, or remove and update components
  eligibility?: string; 
}

export interface MarketPrice {
  id: number;
  cropId?: number;
  marketName: string;
  price: number;
  currency?: string;
  date?: string;
  state?: string;
  district?: string;
  crop?: Crop;
  // Mapped fields
  market?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface DiseaseResult {
  id: string;
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  remedy: string[];
}
