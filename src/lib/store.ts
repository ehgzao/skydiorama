import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  isDay: boolean;
  updatedAt: string;
}

export type WeatherCondition = 
  | 'clear'
  | 'sunny'
  | 'cloudy'
  | 'overcast'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy';

export interface DioramaImage {
  generatedAt: string;
  city: string;
  condition: WeatherCondition;
  isDay: boolean;
}


interface AppState {
  // Cities
  cities: City[];
  currentCityId: string | null;
  addCity: (city: City) => void;
  removeCity: (id: string) => void;
  setCurrentCity: (id: string) => void;
  
  // Weather
  weatherData: Record<string, WeatherData>;
  setWeatherData: (cityId: string, data: WeatherData) => void;
  
  // Diorama
  dioramas: Record<string, DioramaImage>;
  setDiorama: (cityId: string, image: DioramaImage) => void;
  currentDiorama: DioramaImage | null;
  setCurrentDiorama: (image: DioramaImage | null) => void;
  
  // Settings
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  useCustomKey: boolean;
  setUseCustomKey: (use: boolean) => void;
  
  // UI State
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cities
      cities: [],
      currentCityId: null,
      addCity: (city) => set((state) => {
        const exists = state.cities.find(c => c.id === city.id);
        if (exists) return state;
        return { cities: [...state.cities, city] };
      }),
      removeCity: (id) => set((state) => ({
        cities: state.cities.filter(c => c.id !== id),
        currentCityId: state.currentCityId === id ? null : state.currentCityId,
      })),
      setCurrentCity: (id) => set({ currentCityId: id }),
      
      // Weather
      weatherData: {},
      setWeatherData: (cityId, data) => set((state) => ({
        weatherData: { ...state.weatherData, [cityId]: data },
      })),
      
      // Diorama
      dioramas: {},
      setDiorama: (cityId, image) => set((state) => ({
        dioramas: { ...state.dioramas, [cityId]: image },
      })),
      currentDiorama: null,
      setCurrentDiorama: (image) => set({ currentDiorama: image }),
      
      // Settings
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      useCustomKey: false,
      setUseCustomKey: (use) => set({ useCustomKey: use }),
      
      // UI State
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      error: null,
      setError: (error) => set({ error }),
      showSettings: false,
      setShowSettings: (show) => set({ showSettings: show }),
    }),
    {
      name: 'skydiorama-storage',
      partialize: (state) => ({
        cities: state.cities,
        currentCityId: state.currentCityId,
        apiKey: state.apiKey,
        useCustomKey: state.useCustomKey,
        dioramas: state.dioramas, // Apenas metadata, sem URL base64
        // Excluindo campos transientes e pesados:
        // currentDiorama: undefined,
        // isGenerating: undefined,
        // error: undefined,
        // weatherData: undefined,
      }),
    }
  )
);
