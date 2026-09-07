import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  Wind,
  SunMedium,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  formatTemperature,
  formatWindSpeed,
  getUVClassification,
} from '../utils/formatters';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit, windUnit }) => {
  const [expandedDay, setExpandedDay] = useState<string | null>(daily[0]?.date || null);

  // Compute absolute min & max across the 7 days for the visual temperature bars
  const minTempOfWeek = Math.min(...daily.map((d) => d.temperatureMin));
  const maxTempOfWeek = Math.max(...daily.map((d) => d.temperatureMax));
  const tempSpan = Math.max(maxTempOfWeek - minTempOfWeek, 1);

  const toggleExpand = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            7-Day Weather Forecast
          </h3>
        </div>
        <span className="text-xs text-slate-400">Click any day for details</span>
      </div>

      <div className="space-y-2">
        {daily.map((day) => {
          const isExpanded = expandedDay === day.date;
          const uv = getUVClassification(day.uvIndexMax);

          // Calculate percentage offsets for visual temperature bar
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.temperatureMin - minTempOfWeek) / tempSpan) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((day.temperatureMax - minTempOfWeek) / tempSpan) * 100)
          );
          const barWidth = Math.max(rightPercent - leftPercent, 8);

          return (
            <div
              key={day.date}
              className={`rounded-xl border transition-all duration-200 ${
                isExpanded
                  ? 'bg-slate-900/80 border-sky-500/40 shadow-md'
                  : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
              }`}
            >
              {/* Main Day Row */}
              <button
                type="button"
                onClick={() => toggleExpand(day.date)}
                className="w-full text-left px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Day name & Date */}
                <div className="flex items-center space-x-3 sm:w-44 flex-shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <WeatherIcon name={day.condition.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-white">
                        {day.dayName}
                      </span>
                      {day.isToday && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{day.fullDate}</span>
                  </div>
                </div>

                {/* Condition & Rain Chance */}
                <div className="flex items-center justify-between sm:justify-start space-x-4 sm:w-48">
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[130px]">
                    {day.condition.label}
                  </span>
                  {day.precipitationProbabilityMax > 0 ? (
                    <span
                      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                        day.precipitationProbabilityMax >= 50
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Droplets className="w-3 h-3 mr-1 text-sky-400" />
                      {day.precipitationProbabilityMax}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">0% rain</span>
                  )}
                </div>

                {/* Visual Temperature Range Bar */}
                <div className="flex items-center space-x-3 flex-1 max-w-xs justify-end">
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right">
                    {formatTemperature(day.temperatureMin, unit)}
                  </span>

                  {/* Range visual track */}
                  <div className="hidden sm:block flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-amber-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white w-10 text-left">
                    {formatTemperature(day.temperatureMax, unit)}
                  </span>

                  <div className="text-slate-400 pl-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 mt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40">
                      <div className="text-slate-400 flex items-center space-x-1">
                        <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                        <span>Peak UV Index</span>
                      </div>
                      <div className="mt-1 font-semibold text-slate-100 flex items-center space-x-1.5">
                        <span>{day.uvIndexMax}</span>
                        <span className={`text-[10px] px-1 rounded ${uv.badgeBg}`}>
                          {uv.label}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40">
                      <div className="text-slate-400 flex items-center space-x-1">
                        <Wind className="w-3.5 h-3.5 text-teal-400" />
                        <span>Max Wind</span>
                      </div>
                      <div className="mt-1 font-semibold text-slate-100">
                        {formatWindSpeed(day.windSpeedMax, windUnit)}
                      </div>
                    </div>

                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40">
                      <div className="text-slate-400 flex items-center space-x-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" />
                        <span>Precipitation Sum</span>
                      </div>
                      <div className="mt-1 font-semibold text-slate-100">
                        {day.precipitationSum} mm
                      </div>
                    </div>

                    <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40">
                      <div className="text-slate-400 flex items-center space-x-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                        <span>Sun Cycle</span>
                      </div>
                      <div className="mt-1 font-semibold text-slate-100 flex items-center space-x-2">
                        <span>↑ {day.sunrise}</span>
                        <span>↓ {day.sunset}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
