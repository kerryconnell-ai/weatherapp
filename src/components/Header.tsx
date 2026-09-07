import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Compass, X, Sparkles } from 'lucide-react';
import { GeoLocation, TemperatureUnit } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  onSelectCity: (city: GeoLocation) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  currentCityName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
  unit,
  onToggleUnit,
  currentCityName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const list = await searchCities(query);
        setResults(list);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">Weather Intelligence</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Open-Meteo
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                {currentCityName ? `Viewing weather for ${currentCityName}` : 'Atmospheric insights & planning'}
              </p>
            </div>
          </div>

          {/* Mobile unit switch */}
          <div className="sm:hidden flex items-center space-x-2">
            <button
              onClick={onToggleUnit}
              id="unit-toggle-mobile"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Toggle Temperature Unit"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
          </div>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto flex-1 sm:max-w-md justify-end">
          {/* Autocomplete Search Input */}
          <div ref={searchContainerRef} className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="city-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search city, region, or country..."
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="w-4 h-4 text-sky-400 animate-spin absolute right-3 pointer-events-none" />
              )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-700/50 backdrop-blur-lg">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/50">
                  Select Location ({results.length})
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {results.map((item, idx) => (
                    <button
                      key={`${item.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors ${
                        selectedIndex === idx
                          ? 'bg-sky-600/20 text-white'
                          : 'hover:bg-slate-700/50 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-400">
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      {item.country_code && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-700/70 text-slate-300 font-mono">
                          {item.country_code}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isOpen && query.length >= 2 && !isSearching && results.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl z-50 text-center text-xs text-slate-400">
                No cities found for "{query}". Try a different spelling.
              </div>
            )}
          </div>

          {/* Current Location GPS Button */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            id="use-current-location-btn"
            title="Use current device location"
            className="flex items-center justify-center p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-600 transition-all disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <MapPin className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {/* Desktop Unit Switch */}
          <div className="hidden sm:flex bg-slate-800 p-0.5 rounded-xl border border-slate-700/80">
            <button
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              id="unit-celsius-btn"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                unit === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              id="unit-fahrenheit-btn"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
