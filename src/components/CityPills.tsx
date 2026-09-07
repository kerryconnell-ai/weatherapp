import React from 'react';
import { Clock, Flame, X } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { POPULAR_CITIES } from '../services/weatherApi';

interface CityPillsProps {
  currentCityId?: number;
  recentCities: GeoLocation[];
  onSelectCity: (city: GeoLocation) => void;
  onClearRecent?: () => void;
}

export const CityPills: React.FC<CityPillsProps> = ({
  currentCityId,
  recentCities,
  onSelectCity,
  onClearRecent,
}) => {
  return (
    <div className="py-2.5 flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar">
      {/* Quick label */}
      <div className="flex items-center text-xs font-medium text-slate-400 mr-1 flex-shrink-0">
        <Flame className="w-3.5 h-3.5 text-amber-400 mr-1" />
        <span>Popular:</span>
      </div>

      {POPULAR_CITIES.slice(0, 6).map((city) => {
        const isSelected = currentCityId === city.id;
        return (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              isSelected
                ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-400/40'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 hover:text-white'
            }`}
          >
            {city.name}
          </button>
        );
      })}

      {recentCities.length > 0 && (
        <>
          <div className="h-4 w-px bg-slate-700 mx-1 flex-shrink-0" />
          <div className="flex items-center text-xs font-medium text-slate-400 mr-1 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-sky-400 mr-1" />
            <span>Recent:</span>
          </div>

          {recentCities.slice(0, 3).map((city) => (
            <button
              key={`recent-${city.id}`}
              onClick={() => onSelectCity(city)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 border border-slate-700/40 hover:text-white flex items-center space-x-1"
            >
              <span>{city.name}</span>
            </button>
          ))}

          {onClearRecent && recentCities.length > 0 && (
            <button
              onClick={onClearRecent}
              title="Clear recent cities"
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}
    </div>
  );
};
