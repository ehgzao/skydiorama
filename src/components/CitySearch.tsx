'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchCities, GeocodingResult } from '@/lib/weather';

interface CitySearchProps {
  onSelect: (city: GeocodingResult) => void;
  onCurrentLocation: () => void;
  isLoadingLocation: boolean;
}

export function CitySearch({ onSelect, onCurrentLocation, isLoadingLocation }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    onSelect(city);
    setQuery('');
    setResults([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for a city..."
          className="input-glass pl-12 pr-20"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-2 text-white/40 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onCurrentLocation}
            disabled={isLoadingLocation}
            className="p-2 text-white/40 hover:text-sky-400 transition-colors disabled:opacity-50"
            title="Use current location"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {isFocused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden glass-strong z-50"
          >
            {results.map((city, index) => (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
              >
                <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{city.name}</p>
                  <p className="text-white/50 text-sm">
                    {city.admin1 && `${city.admin1}, `}{city.country}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
