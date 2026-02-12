import { WeatherCondition, WeatherData } from './store';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];
  
  const url = `${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `${OPEN_METEO_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather fetch failed');
  
  const data = await response.json();
  const current = data.current;
  
  const { condition, description, icon } = parseWeatherCode(
    current.weather_code,
    current.is_day === 1
  );
  
  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    condition,
    description,
    icon,
    isDay: current.is_day === 1,
    updatedAt: new Date().toISOString(),
  };
}

function parseWeatherCode(code: number, isDay: boolean): {
  condition: WeatherCondition;
  description: string;
  icon: string;
} {
  // WMO Weather interpretation codes
  // https://open-meteo.com/en/docs
  
  if (code === 0) {
    return {
      condition: isDay ? 'sunny' : 'clear',
      description: isDay ? 'Clear sky' : 'Clear night',
      icon: isDay ? '☀️' : '🌙',
    };
  }
  
  if (code === 1 || code === 2) {
    return {
      condition: isDay ? 'sunny' : 'clear',
      description: 'Partly cloudy',
      icon: isDay ? '🌤️' : '☁️',
    };
  }
  
  if (code === 3) {
    return {
      condition: 'overcast',
      description: 'Overcast',
      icon: '☁️',
    };
  }
  
  if (code >= 45 && code <= 48) {
    return {
      condition: 'foggy',
      description: 'Foggy',
      icon: '🌫️',
    };
  }
  
  if (code >= 51 && code <= 57) {
    return {
      condition: 'rainy',
      description: 'Drizzle',
      icon: '🌧️',
    };
  }
  
  if (code >= 61 && code <= 67) {
    return {
      condition: 'rainy',
      description: 'Rain',
      icon: '🌧️',
    };
  }
  
  if (code >= 71 && code <= 77) {
    return {
      condition: 'snowy',
      description: 'Snow',
      icon: '❄️',
    };
  }
  
  if (code >= 80 && code <= 82) {
    return {
      condition: 'rainy',
      description: 'Rain showers',
      icon: '🌦️',
    };
  }
  
  if (code >= 85 && code <= 86) {
    return {
      condition: 'snowy',
      description: 'Snow showers',
      icon: '🌨️',
    };
  }
  
  if (code >= 95 && code <= 99) {
    return {
      condition: 'stormy',
      description: 'Thunderstorm',
      icon: '⛈️',
    };
  }
  
  // Default
  return {
    condition: 'cloudy',
    description: 'Cloudy',
    icon: '☁️',
  };
}

export async function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
  // Open-Meteo doesn't have reverse geocoding, so we use a workaround
  // by searching for nearby cities
  const url = `${GEOCODING_BASE}/search?name=city&count=1&language=en&format=json`;
  
  // For MVP, we'll use the IP-based location name from another service
  // or just return coordinates
  try {
    const response = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      id: Math.random() * 1000000,
      name: data.address?.city || data.address?.town || data.address?.village || 'Current Location',
      latitude: lat,
      longitude: lon,
      country: data.address?.country || '',
      country_code: data.address?.country_code?.toUpperCase() || '',
    };
  } catch {
    return {
      id: Math.random() * 1000000,
      name: 'Current Location',
      latitude: lat,
      longitude: lon,
      country: '',
      country_code: '',
    };
  }
}
