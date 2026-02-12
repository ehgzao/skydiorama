'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, RefreshCw, Sparkles } from 'lucide-react';
import { WeatherCondition } from '@/lib/store';

interface DioramaDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  city: string;
  temperature: number;
  condition: WeatherCondition;
  onRefresh: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export function DioramaDisplay({
  imageUrl,
  isLoading,
  city,
  temperature,
  condition,
  onRefresh,
  onDownload,
  onShare,
}: DioramaDisplayProps) {
  // Weather-based glow classes
  const weatherGlowClass: Record<WeatherCondition, string> = {
    clear: 'glow-clear',
    sunny: 'glow-sunny',
    cloudy: 'glow-cloudy',
    overcast: 'glow-overcast',
    rainy: 'glow-rainy',
    stormy: 'glow-stormy',
    snowy: 'glow-snowy',
    foggy: 'glow-foggy',
    windy: 'glow-windy',
  };

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
    <div className="diorama-container group">
      {/* Background gradient based on weather */}
      <div 
        className={`absolute inset-0 weather-${condition} opacity-50 transition-opacity duration-1000`}
      />
      
      {/* Loading state */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-storm-900/80 backdrop-blur-sm z-10"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mb-4"
            >
              <Sparkles className="w-12 h-12 text-sky-400" />
            </motion.div>
            <p className="text-white/80 font-medium">Crafting your diorama...</p>
            <p className="text-white/50 text-sm mt-1">This may take a moment</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Image or placeholder */}
      {imageUrl ? (
        <div className={`diorama-container ${weatherGlowClass[condition]}`}>
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            src={imageUrl}
            alt={`${city} weather diorama`}
            className="diorama-image w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            {conditionIcons[condition]}
          </motion.div>
          <p className="text-white/60 text-center px-8">
            Click &quot;Generate&quot; to create your weather diorama
          </p>
        </div>
      )}
      
      {/* Overlay info */}
      {imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-sm uppercase tracking-wider mb-1">
                  {condition}
                </p>
                <h3 className="city-name text-white">{city}</h3>
              </div>
              <div className="text-right">
                <span className="temp-display text-white text-5xl">
                  {temperature}°
                </span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
