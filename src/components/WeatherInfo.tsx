'use client';

import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Eye } from 'lucide-react';
import { WeatherData, WeatherCondition } from '@/lib/store';

interface WeatherInfoProps {
  weather: WeatherData;
  city: string;
}

export function WeatherInfo({ weather, city }: WeatherInfoProps) {
  const conditionIcons: Record<WeatherCondition, string> = {
    clear: '🌙',
    sunny: '☀️',
    cloudy: '☁️',
    overcast: '☁️',
    rainy: '🌧️',
    stormy: '⛈️',
    snowy: '❄️',
    foggy: '🌫️',
    windy: '💨',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Main temperature display */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="city-name gradient-text mb-1">{city}</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{conditionIcons[weather.condition]}</span>
            <span className="weather-badge">{weather.description}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="temp-display gradient-text">{weather.temperature}°</p>
          <p className="text-white/50 text-sm">
            Feels like {weather.feelsLike}°
          </p>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 gap-4">
        <WeatherStat
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={`${weather.humidity}%`}
        />
        <WeatherStat
          icon={<Wind className="w-5 h-5" />}
          label="Wind"
          value={`${weather.windSpeed} km/h`}
        />
        <WeatherStat
          icon={<Thermometer className="w-5 h-5" />}
          label="Feels Like"
          value={`${weather.feelsLike}°C`}
        />
        <WeatherStat
          icon={<Eye className="w-5 h-5" />}
          label="Time"
          value={weather.isDay ? 'Daytime' : 'Nighttime'}
        />
      </div>

      {/* Last updated */}
      <p className="text-white/30 text-xs mt-4 text-center">
        Updated {new Date(weather.updatedAt).toLocaleTimeString()}
      </p>
    </motion.div>
  );
}

function WeatherStat({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
      <div className="text-sky-400">{icon}</div>
      <div>
        <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
