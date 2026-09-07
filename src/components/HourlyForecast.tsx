import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../utils/formatters';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Hourly Outlook (Next 24 Hours)
          </h3>
        </div>
        <span className="text-xs text-slate-400">Scroll horizontally →</span>
      </div>

      {/* Horizontal scrolling strip */}
      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hourly.map((item, idx) => {
          const isHighRain = item.precipitationProbability >= 40;
          return (
            <div
              key={`${item.time}-${idx}`}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all min-w-[88px] ${
                item.isCurrentHour
                  ? 'bg-sky-600/20 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              {/* Time */}
              <span
                className={`text-xs font-semibold ${
                  item.isCurrentHour ? 'text-sky-300' : 'text-slate-300'
                }`}
              >
                {item.formattedTime}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  name={item.condition.iconName}
                  className="w-8 h-8 transition-transform hover:scale-110"
                />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold text-white">
                {formatTemperature(item.temperature, unit)}
              </span>

              {/* Rain chance */}
              <div className="mt-2 flex items-center space-x-1 text-[11px]">
                <Droplets
                  className={`w-3 h-3 ${
                    isHighRain ? 'text-sky-400' : 'text-slate-500'
                  }`}
                />
                <span
                  className={`font-medium ${
                    isHighRain ? 'text-sky-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {item.precipitationProbability}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
