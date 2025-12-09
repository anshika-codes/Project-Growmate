export enum PlantType {
  Flowering = 'flowering',
  NonFlowering = 'non-flowering',
  Succulent = 'succulent',
  Fern = 'fern',
  Herb = 'herb',
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  plantType: PlantType;
  age: number; // in months
  leaves: number;
  buds: number;
  flowers: number;
  photoBase64: string | null;
  lastWatered?: string; // ISO Date String: YYYY-MM-DD
}

export interface CareSuggestions {
  potting: string;
  soil: string;
  sunlight: string;
  watering: string;
  fertilizer: string;
  seasonal_care: string;
}

export interface Weather {
  condition: string;
  temperature: number; // Celsius
  humidity: number; // Percentage
  suggestion: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
