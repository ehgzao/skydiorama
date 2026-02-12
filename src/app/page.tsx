'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, Github, Sparkles, AlertCircle } from 'lucide-react';
import { 
  DioramaDisplay, 
  CitySearch, 
  WeatherInfo, 
  SettingsPanel,
  CityList,
  CacheInfo 
} from '@/components';
import { useAppStore, City, WeatherData } from '@/lib/store';
import { getWeather, getCurrentLocation, reverseGeocode, GeocodingResult } from '@/lib/weather';
import { generateDiorama } from '@/lib/gemini';
import { cacheDiorama, getCachedDiorama } from '@/lib/image-cache';

export default function Home() {
  const [currentDioramaUrl, setCurrentDioramaUrl] = useState<string | null>(null);
  
  const {
    cities,
    currentCityId,
    addCity,
    removeCity,
    setCurrentCity,
    weatherData,
    setWeatherData,
    dioramas,
    setDiorama,
    currentDiorama,
    setCurrentDiorama,
    apiKey,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    showSettings,
    setShowSettings,
  } = useAppStore();

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Get current city object
  const currentCity = cities.find(c => c.id === currentCityId);
  const currentWeather = currentCityId ? weatherData[currentCityId] : null;
  const currentImage = currentCityId ? dioramas[currentCityId] : null;

  // Load image from IndexedDB when city changes
  useEffect(() => {
    const loadImage = async () => {
      if (currentCityId && currentImage) {
        const imageUrl = await getCachedDiorama(currentCityId);
        setCurrentDioramaUrl(imageUrl || null);
      } else {
        setCurrentDioramaUrl(null);
      }
    };
    
    loadImage();
  }, [currentCityId, currentImage]);

  // Clean legacy localStorage on app start
  useEffect(() => {
    const cleanLegacyStorage = () => {
      try {
        const stored = localStorage.getItem('skydiorama-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.dioramas) {
            console.log('🧹 Cleaning legacy localStorage with base64 images...');
            // Remove dioramas from localStorage
            delete parsed.state.dioramas;
            delete parsed.state.currentDiorama;
            localStorage.setItem('skydiorama-storage', JSON.stringify(parsed));
            console.log('✅ Legacy localStorage cleaned');
          }
        }
      } catch (e) {
        console.error('❌ Error cleaning legacy storage:', e);
        // If localStorage is corrupted, clear everything
        localStorage.removeItem('skydiorama-storage');
      }
    };
    
    cleanLegacyStorage();
  }, []);

  // Handle city selection from search
  const handleCitySelect = useCallback(async (geocoding: GeocodingResult) => {
    const city: City = {
      id: `${geocoding.latitude}-${geocoding.longitude}`,
      name: geocoding.name,
      country: geocoding.country,
      lat: geocoding.latitude,
      lon: geocoding.longitude,
    };

    addCity(city);
    setCurrentCity(city.id);
    setError(null);

    // Fetch weather for the new city
    setIsLoadingWeather(true);
    try {
      const weather = await getWeather(city.lat, city.lon);
      setWeatherData(city.id, weather);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [addCity, setCurrentCity, setWeatherData, setError]);

  // Handle current location
  const handleCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      const geocoding = await reverseGeocode(coords.lat, coords.lon);
      
      if (geocoding) {
        await handleCitySelect(geocoding);
      }
    } catch (err) {
      setError('Could not get your location. Please search for a city instead.');
      console.error(err);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [handleCitySelect, setError]);

  // Handle city selection from list
  const handleCityFromList = useCallback(async (city: City) => {
    setCurrentCity(city.id);
    setError(null);

    // Refresh weather if older than 30 minutes
    const existingWeather = weatherData[city.id];
    const isStale = !existingWeather || 
      (Date.now() - new Date(existingWeather.updatedAt).getTime()) > 30 * 60 * 1000;

    if (isStale) {
      setIsLoadingWeather(true);
      try {
        const weather = await getWeather(city.lat, city.lon);
        setWeatherData(city.id, weather);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingWeather(false);
      }
    }
  }, [setCurrentCity, weatherData, setWeatherData, setError]);

  // Generate diorama
  const handleGenerate = useCallback(async () => {
    if (!currentCity || !currentWeather) {
      setError('Please select a city first');
      return;
    }

    if (!apiKey) {
      setShowSettings(true);
      setError('Please add your Gemini API key to generate dioramas');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // DEBUG: Log parameters to verify city/country are correct
      console.log('Generating diorama for:', { 
        city: currentCity.name, 
        country: currentCity.country,
        condition: currentWeather.condition,
        temperature: currentWeather.temperature,
        isDay: currentWeather.isDay
      });

      const imageUrl = await generateDiorama({
        city: currentCity.name,
        country: currentCity.country,
        condition: currentWeather.condition,
        temperature: currentWeather.temperature,
        isDay: currentWeather.isDay,
        apiKey,
      });

      // Salvar imagem no IndexedDB
      await cacheDiorama(currentCity.id, imageUrl);
      
      // Salvar apenas metadata no localStorage
      setDiorama(currentCity.id, {
        generatedAt: new Date().toISOString(),
        city: currentCity.name,
        condition: currentWeather.condition,
        isDay: currentWeather.isDay,
      });
      
      // Definir imagem atual
      setCurrentDioramaUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to generate diorama');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [currentCity, currentWeather, apiKey, setIsGenerating, setError, setDiorama, setCurrentDiorama, setShowSettings]);

  // Download diorama
  const handleDownload = useCallback(() => {
    if (!currentDioramaUrl) return;

    const link = document.createElement('a');
    link.href = currentDioramaUrl;
    link.download = `skydiorama-${currentCity?.name || 'weather'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentDioramaUrl, currentCity]);

  // Share diorama
  const handleShare = useCallback(async () => {
    if (!currentDioramaUrl || !currentCity) return;

    if (navigator.share) {
      try {
        // Convert base64 to blob
        const response = await fetch(currentDioramaUrl);
        const blob = await response.blob();
        const file = new File([blob], `skydiorama-${currentCity.name}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${currentCity.name} Weather Diorama`,
          text: `Check out this AI-generated weather diorama for ${currentCity.name}! Made with SkyDiorama.`,
          files: [file],
        });
      } catch (err) {
        // Fallback: copy to clipboard
        console.log('Share failed, trying clipboard');
      }
    }
  }, [currentImage, currentCity]);

  // Auto-load weather on first city select
  useEffect(() => {
    if (currentCityId && !weatherData[currentCityId]) {
      const city = cities.find(c => c.id === currentCityId);
      if (city) {
        setIsLoadingWeather(true);
        getWeather(city.lat, city.lon)
          .then(weather => setWeatherData(currentCityId, weather))
          .catch(console.error)
          .finally(() => setIsLoadingWeather(false));
      }
    }
  }, [currentCityId, cities, weatherData, setWeatherData]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <span className="text-xl">🏙️</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-xl">SkyDiorama</h1>
              <p className="text-white/40 text-xs">AI Weather Art</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <a
              href="https://github.com/ehgzao"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Github className="w-5 h-5 text-white/60 hover:text-white" />
            </a>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-white/60 hover:text-white" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[350px_1fr] gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Search */}
              <CitySearch
                onSelect={handleCitySelect}
                onCurrentLocation={handleCurrentLocation}
                isLoadingLocation={isLoadingLocation}
              />

              {/* City list */}
              <CityList
                cities={cities}
                currentCityId={currentCityId}
                weatherData={weatherData}
                onSelect={handleCityFromList}
                onRemove={removeCity}
              />

              {/* Weather info */}
              {currentWeather && currentCity && (
                <WeatherInfo weather={currentWeather} city={currentCity.name} />
              )}

              {/* Generate button */}
              {currentCity && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !apiKey}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? 'Generating...' : 'Generate Diorama'}
                </motion.button>
              )}

              {/* API key reminder */}
              {!apiKey && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">API Key Required</p>
                      <p className="text-white/60 text-xs mt-1">
                        Add your free Gemini API key in{' '}
                        <button
                          onClick={() => setShowSettings(true)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Settings
                        </button>{' '}
                        to generate dioramas.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Cache Info */}
              <CacheInfo />
            </motion.aside>

            {/* Main area - Diorama display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col"
            >
              {/* Empty state */}
              {!currentCity && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-8xl mb-6"
                    >
                      🌤️
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Welcome to SkyDiorama
                    </h2>
                    <p className="text-white/60 mb-6">
                      Search for a city or use your current location to see the weather
                      transformed into a beautiful AI-generated 3D isometric diorama.
                    </p>
                    <button
                      onClick={handleCurrentLocation}
                      disabled={isLoadingLocation}
                      className="btn-primary"
                    >
                      {isLoadingLocation ? 'Getting location...' : 'Use Current Location'}
                    </button>
                  </div>
                </div>
              )}

              {/* Diorama */}
              {currentCity && currentWeather && (
                <DioramaDisplay
                  imageUrl={currentDioramaUrl}
                  isLoading={isGenerating}
                  city={currentCity.name}
                  temperature={currentWeather.temperature}
                  condition={currentWeather.condition}
                  onRefresh={handleGenerate}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              )}

              {/* Error display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-200 text-sm">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-white/30 text-sm">
          Open source • Free forever •{' '}
          <a
            href="https://github.com/ehgzao"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/50"
          >
            Contribute on GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
