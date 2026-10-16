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
  popularIndianName?: string;
  expectedYieldTonnesPerHa?: number;
  expectedTotalHarvestTonnes?: number;
}

export interface Stage1DomainResult {
  category: string;
  confidence_pct: number;
}

export interface Stage2CropRecommendation {
  rank: number;
  crop_name: string;
  popular_indian_name?: string;
  confidence_pct: number;
  expected_yield_tonnes_per_ha: number;
  expected_total_harvest_tonnes: number;
  cropDetails?: Crop;
}

export interface FarmSummary {
  location: string;
  state?: string;
  district?: string;
  cultivated_area_ha: number;
  cultivated_area_acres?: number;
  season: string;
  soil_type: string;
  soil_moisture_pct?: number;
  soil_ph?: number;
  npk_used?: {
    Nitrogen_N?: number;
    Phosphorus_P?: number;
    Potassium_K?: number;
    N?: number;
    P?: number;
    K?: number;
    source?: string;
  };
}

export interface ToDoItem {
  id: string;
  category: 'Sowing' | 'Preparation' | 'Irrigation' | 'Fertilizer' | 'Pest' | 'Harvest';
  task: string;
  dueDate: string;
  completed: boolean;
}

export interface Scheme {
  id: number | string;
  name: string;
  description: string;
  eligibilityCriteria?: string;
  applicationLink?: string;
  deadline?: string | null;
  category?: string;
  funding?: string;
  state?: string;
  source?: string;
  isLiveGovData?: boolean;
  // Mapped fields for backward compatibility if needed
  eligibility?: string; 
}

export interface MarketPrice {
  id: number | string;
  cropId?: number;
  marketName: string;
  price: number;
  currency?: string;
  date?: string;
  state?: string;
  district?: string;
  crop?: Crop;
  // Mapped fields & data.gov.in AGMARKNET fields
  market?: string;
  commodity?: string;
  variety?: string;
  minPrice?: number;
  maxPrice?: number;
  source?: string;
  isLiveGovData?: boolean;
  trend?: 'up' | 'down' | 'stable';
}

export interface DiseaseResult {
  id: string;
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  remedy: string[];
}
