import React from 'react';
import {
  SunMedium,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Navigation,
  CloudRain,
} from 'lucide-react';
import { WeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatWindSpeed,
  getWindDirection,
  getUVClassification,
  getHumidityComfort,
} from '../utils/formatters';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  weather,
  windUnit,
}) => {
  const { current, daily } = weather;
  const today = daily[0];

  const uv = getUVClassification(current.uvIndex);
  const humidityStatus = getHumidityComfort(current.relativeHumidity);

  // Approximate daylight progress if today's sunrise/sunset available
  let daylightPct = 50;
  let sunriseStr = today?.sunrise || '06:00';
  let sunsetStr = today?.sunset || '19:30';

  if (today?.sunrise && today?.sunset) {
    const [srH, srM] = today.sunrise.split(':').map(Number);
    const [ssH, ssM] = today.sunset.split(':').map(Number);
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const srMin = srH * 60 + srM;
    const ssMin = ssH * 60 + ssM;

    if (curMin < srMin) daylightPct = 0;
    else if (curMin > ssMin) daylightPct = 100;
    else daylightPct = Math.round(((curMin - srMin) / (ssMin - srMin)) * 100);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        <span>Atmospheric Conditions & Gauges</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. UV Index */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>Solar UV Index</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${uv.badgeBg}`}>
              {uv.label}
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold text-white">{current.uvIndex}</div>
            <p className="text-xs text-slate-400 mt-1">
              Peak UV today reaching {today?.uvIndexMax ?? current.uvIndex}.
            </p>
          </div>

          {/* UV Scale Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
              style={{ width: `${Math.min((current.uvIndex / 11) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Wind & Direction */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Wind & Airflow</span>
            </span>
            <span className="text-slate-300 font-mono text-xs">
              {getWindDirection(current.windDirection)} ({current.windDirection}°)
            </span>
          </div>

          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-3xl font-bold text-white">
                {formatWindSpeed(current.windSpeed, windUnit)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gusts up to {formatWindSpeed(current.windGusts, windUnit)}
              </p>
            </div>

            {/* Compass dial */}
            <div className="w-12 h-12 rounded-full border border-slate-600/80 bg-slate-900 flex items-center justify-center relative shadow-inner">
              <span className="absolute text-[8px] top-0.5 text-slate-400 font-semibold">N</span>
              <div
                className="transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <Navigation className="w-5 h-5 text-sky-400 fill-sky-400/30" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Max gust speed forecasted at {formatWindSpeed(today?.windSpeedMax || current.windSpeed, windUnit)}
          </div>
        </div>

        {/* 3. Humidity & Comfort */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>Relative Humidity</span>
            </span>
            <span className="text-sky-300 font-semibold text-xs">
              {humidityStatus.label}
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold text-white">{current.relativeHumidity}%</div>
            <p className="text-xs text-slate-400 mt-1">{humidityStatus.description}</p>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
        </div>

        {/* 4. Atmospheric Pressure */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span>Atmospheric Pressure</span>
            </span>
            <span className="text-xs text-slate-300">Sea Level</span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold text-white">
              {current.surfacePressure}{' '}
              <span className="text-sm font-normal text-slate-400">hPa</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {current.surfacePressure > 1013
                ? 'High pressure system (typically fair, stable weather)'
                : 'Low pressure system (increased chance of cloudiness & rain)'}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Standard baseline: 1013.25 hPa
          </div>
        </div>

        {/* 5. Sunrise & Sunset Daylight Cycle */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>Solar Day Cycle</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">{daylightPct}% Elapsed</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2.5">
            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/40">
              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                <span>Sunrise</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">{sunriseStr}</div>
            </div>

            <div className="bg-slate-900/40 p-2 rounded-xl border border-slate-700/40">
              <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                <Sunset className="w-3.5 h-3.5 text-rose-300" />
                <span>Sunset</span>
              </div>
              <div className="text-sm font-bold text-white mt-1">{sunsetStr}</div>
            </div>
          </div>

          {/* Daylight progress line */}
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"
              style={{ width: `${daylightPct}%` }}
            />
          </div>
        </div>

        {/* 6. Precipitation Summary */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Precipitation Summary</span>
            </span>
            <span className="text-xs font-semibold text-sky-300">
              {today?.precipitationProbabilityMax || 0}% Chance
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold text-white">
              {today?.precipitationSum || 0}{' '}
              <span className="text-sm font-normal text-slate-400">mm expected</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Current intensity: {current.precipitation > 0 ? `${current.precipitation} mm/h` : 'None detected'}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            7-day rain total estimated: {Math.round(daily.reduce((acc, d) => acc + d.precipitationSum, 0) * 10) / 10} mm
          </div>
        </div>
      </div>
    </div>
  );
};
