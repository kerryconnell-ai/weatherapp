import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    const mph = Math.round(kmh * 0.621371 * 10) / 10;
    return `${mph} mph`;
  }
  return `${kmh} km/h`;
}

export function getWindDirection(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUVClassification(uv: number): {
  label: string;
  color: string;
  badgeBg: string;
} {
  if (uv < 3) {
    return {
      label: 'Low',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    };
  }
  if (uv < 6) {
    return {
      label: 'Moderate',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    };
  }
  if (uv < 8) {
    return {
      label: 'High',
      color: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    };
  }
  if (uv < 11) {
    return {
      label: 'Very High',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    };
  }
  return {
    label: 'Extreme',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  };
}

export function getHumidityComfort(humidity: number): {
  label: string;
  description: string;
} {
  if (humidity < 30) {
    return { label: 'Dry', description: 'Low moisture, consider hydrating' };
  }
  if (humidity <= 60) {
    return { label: 'Comfortable', description: 'Optimal indoor and outdoor air' };
  }
  if (humidity <= 75) {
    return { label: 'Humid', description: 'Noticeable moisture in the atmosphere' };
  }
  return { label: 'Very Muggy', description: 'High oppressive moisture level' };
}

export function formatTimeInZone(timeIso: string, timezone: string): string {
  try {
    const d = new Date(timeIso);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return timeIso.slice(11, 16);
  }
}
