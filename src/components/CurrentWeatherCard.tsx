import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  SunMedium,
  Gauge,
} from 'lucide-react';
import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  formatTemperature,
  formatWindSpeed,
  getWindDirection,
  getUVClassification,
} from '../utils/formatters';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
  windUnit,
}) => {
  const { location, current, daily, timezone } = weather;
  const today = daily[0];
  const uvInfo = getUVClassification(current.uvIndex);

  // Formatted local date & time
  const now = new Date();
  let localTimeString = '';
  let localDateString = '';

  try {
    localTimeString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    localDateString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(now);
  } catch {
    localTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localDateString = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/95 via-slate-800/80 to-slate-900 border border-slate-700/70 p-6 md:p-8 shadow-xl"
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-6">
        {/* Top bar: City location info & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/50">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {location.name}
              </h1>
              {location.country_code && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600/40">
                  {location.country_code}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-0.5 ml-7">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-300 ml-7 sm:ml-0 bg-slate-900/40 px-3.5 py-1.5 rounded-xl border border-slate-700/40 w-fit">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{localDateString}</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-slate-200">{localTimeString}</span>
            </div>
          </div>
        </div>

        {/* Middle hero: Huge Temperature, Icon, and Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
          <div className="md:col-span-7 flex items-center space-x-6">
            <div className="relative flex items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 shadow-inner">
              <WeatherIcon
                name={current.condition.iconName}
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>

            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                  {formatTemperature(current.temperature, unit)}
                </span>
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <span className="text-base sm:text-lg font-semibold text-slate-100">
                  {current.condition.label}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-sm text-slate-400">
                  Feels like {formatTemperature(current.apparentTemperature, unit)}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {current.condition.description}
              </p>
            </div>
          </div>

          {/* High / Low & Quick Stats */}
          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col justify-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            {today && (
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Today's Range</span>
                <div className="flex items-center space-x-3 text-sm font-semibold">
                  <span className="flex items-center text-rose-400">
                    <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemperature(today.temperatureMax, unit)}
                  </span>
                  <span className="flex items-center text-sky-400">
                    <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemperature(today.temperatureMin, unit)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Droplets className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">Humidity</div>
                  <div className="font-semibold">{current.relativeHumidity}%</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <Wind className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">Wind ({getWindDirection(current.windDirection)})</div>
                  <div className="font-semibold">{formatWindSpeed(current.windSpeed, windUnit)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <SunMedium className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">UV Index</div>
                  <div className="font-semibold flex items-center space-x-1">
                    <span>{current.uvIndex}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${uvInfo.badgeBg}`}>
                      {uvInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <Gauge className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] text-slate-400">Pressure</div>
                  <div className="font-semibold">{current.surfacePressure} hPa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
