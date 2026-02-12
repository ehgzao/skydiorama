'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ChevronRight } from 'lucide-react';
import { City, WeatherData, WeatherCondition } from '@/lib/store';

interface CityListProps {
  cities: City[];
  currentCityId: string | null;
  weatherData: Record<string, WeatherData>;
  onSelect: (city: City) => void;
  onRemove: (id: string) => void;
}

export function CityList({
  cities,
  currentCityId,
  weatherData,
  onSelect,
  onRemove,
}: CityListProps) {
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

  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider px-1">
        Saved Cities
      </h3>
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {cities.map((city, index) => {
            const weather = weatherData[city.id];
            const isActive = city.id === currentCityId;

            return (
              <motion.div
                key={city.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-sky-500/20 border border-sky-500/30' 
                    : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                  }
                `}
                onClick={() => onSelect(city)}
              >
                {/* City icon/weather */}
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                  {weather ? conditionIcons[weather.condition] : <MapPin className="w-5 h-5 text-white/40" />}
                </div>

                {/* City info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{city.name}</p>
                  <p className="text-white/50 text-sm truncate">{city.country}</p>
                </div>

                {/* Temperature */}
                {weather && (
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{weather.temperature}°</p>
                    <p className="text-white/40 text-xs">{weather.condition}</p>
                  </div>
                )}

                {/* Arrow indicator */}
                <ChevronRight 
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-white/20 group-hover:text-white/40'
                  }`} 
                />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(city.id);
                  }}
                  className="absolute -top-1 -right-1 p-1 rounded-full bg-storm-800 border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                >
                  <X className="w-3 h-3 text-white/60 hover:text-red-400" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
