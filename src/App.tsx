import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CityPills } from './components/CityPills';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { GeoLocation, WeatherData, TemperatureUnit, WindSpeedUnit } from './types/weather';
import { fetchWeatherData, reverseGeocode, POPULAR_CITIES } from './services/weatherApi';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

const LOCAL_STORAGE_LAST_CITY = 'weather_intelligence_last_city';
const LOCAL_STORAGE_RECENT_CITIES = 'weather_intelligence_recent_cities';
const LOCAL_STORAGE_TEMP_UNIT = 'weather_intelligence_temp_unit';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LAST_CITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse last city from localStorage', e);
    }
    return POPULAR_CITIES[0]; // New York as default
  });

  const [recentCities, setRecentCities] = useState<GeoLocation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENT_CITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse recent cities from localStorage', e);
    }
    return [];
  });

  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TEMP_UNIT);
      if (saved === 'fahrenheit' || saved === 'celsius') return saved;
    } catch {
      // ignore
    }
    return 'celsius';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>('kmh');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync wind unit with temperature unit for user comfort
  useEffect(() => {
    setWindUnit(tempUnit === 'fahrenheit' ? 'mph' : 'kmh');
  }, [tempUnit]);

  // Fetch weather data for the selected city
  const loadWeather = useCallback(async (city: GeoLocation, isSilentRefresh: boolean = false) => {
    if (!isSilentRefresh) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(city);
      setWeather(data);

      // Save to last city in localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_LAST_CITY, JSON.stringify(city));
      } catch (err) {
        console.warn('Failed to save last city', err);
      }
    } catch (err: unknown) {
      console.error('Error fetching weather data:', err);
      const message = err instanceof Error ? err.message : 'Failed to retrieve weather data from Open-Meteo.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // On city selection
  const handleSelectCity = useCallback((city: GeoLocation) => {
    setSelectedCity(city);

    // Update recent cities (filter duplicates, limit to 6)
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.name.toLowerCase() !== city.name.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT_CITIES, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save recent cities', err);
      }
      return updated;
    });

    loadWeather(city);
  }, [loadWeather]);

  // Initial load
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await reverseGeocode(latitude, longitude);
          handleSelectCity(loc);
        } catch (err) {
          console.error('Reverse geocode failed:', err);
          setError('Could not identify current city location.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setError('Location access denied or unavailable. Please search manually.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleToggleUnit = () => {
    const nextUnit: TemperatureUnit = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(nextUnit);
    try {
      localStorage.setItem(LOCAL_STORAGE_TEMP_UNIT, nextUnit);
    } catch (e) {
      console.warn('Failed to save unit to localStorage', e);
    }
  };

  const handleClearRecent = () => {
    setRecentCities([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_RECENT_CITIES);
    } catch (e) {
      console.warn('Failed to clear recent cities', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        onSelectCity={handleSelectCity}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        unit={tempUnit}
        onToggleUnit={handleToggleUnit}
        currentCityName={weather?.location.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* City Quick Pills & Recent Searches */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <CityPills
            currentCityId={selectedCity.id}
            recentCities={recentCities}
            onSelectCity={handleSelectCity}
            onClearRecent={handleClearRecent}
          />

          {/* Refresh Action & Fetch time */}
          <div className="flex items-center justify-end space-x-3 text-xs text-slate-400">
            {weather && (
              <span className="hidden md:inline">
                Synced with Open-Meteo
              </span>
            )}
            <button
              onClick={() => loadWeather(selectedCity, true)}
              disabled={isLoading || isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-100">Unable to retrieve weather data</p>
              <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
              <button
                onClick={() => loadWeather(selectedCity)}
                className="mt-2 text-xs font-semibold underline hover:text-white"
              >
                Try reloading
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Weather Dashboard View */}
        {!isLoading && weather && (
          <div className="space-y-6">
            {/* 1. Hero Current Weather Card */}
            <CurrentWeatherCard
              weather={weather}
              unit={tempUnit}
              windUnit={windUnit}
            />

            {/* 2. Weather Intelligence & Planning Recommendations */}
            <PlanningIntelligence
              intelligence={weather.intelligence}
              unit={tempUnit}
            />

            {/* 3. 24-Hour Hourly Forecast */}
            <HourlyForecast
              hourly={weather.hourly}
              unit={tempUnit}
            />

            {/* 4. 7-Day Forecast & Detailed Atmospheric Gauges Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-6">
                <DailyForecast
                  daily={weather.daily}
                  unit={tempUnit}
                  windUnit={windUnit}
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <WeatherMetricsGrid
                  weather={weather}
                  unit={tempUnit}
                  windUnit={windUnit}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean, informative footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Weather Intelligence</span>
            <span>•</span>
            <span>Open-Meteo High-Resolution Forecasts</span>
          </div>
          <div>
            Free meteorological modeling powered by WMO meteorological satellites & national weather models.
          </div>
        </div>
      </footer>
    </div>
  );
}
