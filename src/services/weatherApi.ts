import { GeoLocation, WeatherCondition, WeatherData, HourlyForecastItem, DailyForecastItem } from '../types/weather';
import { generateWeatherIntelligence } from '../utils/weatherIntelligence';

/**
 * Maps WMO weather code to condition metadata including Lucide icon names.
 */
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Sunny and cloudless skies' : 'Clear starry skies',
        iconName: isDay ? 'Sun' : 'Moon',
        isDay,
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Scattered fair-weather clouds',
        iconName: isDay ? 'Sun' : 'Moon',
        isDay,
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Intermittent sunshine with cloud cover',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        isDay,
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud blanket covering the sky',
        iconName: 'Cloud',
        isDay,
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy',
        description: 'Low visibility due to mist and dense fog',
        iconName: 'CloudFog',
        isDay,
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: 'Drizzle',
        description: 'Fine misting precipitation',
        iconName: 'CloudDrizzle',
        isDay,
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Freezing droplets with icy surfaces risk',
        iconName: 'CloudHail',
        isDay,
      };
    case 61:
      return {
        code,
        label: 'Light Rain',
        description: 'Gentle passing rainfall',
        iconName: 'CloudRain',
        isDay,
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Steady rainfall throughout the area',
        iconName: 'CloudRain',
        isDay,
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense downpour with heavy accumulation',
        iconName: 'CloudRain',
        isDay,
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Hazardous freezing rain causing glaze ice',
        iconName: 'CloudHail',
        isDay,
      };
    case 71:
      return {
        code,
        label: 'Light Snow',
        description: 'Light fluttering snowflakes',
        iconName: 'CloudSnow',
        isDay,
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        description: 'Steady snowfall accumulating on ground',
        iconName: 'CloudSnow',
        isDay,
      };
    case 75:
    case 77:
      return {
        code,
        label: 'Heavy Snow',
        description: 'Substantial snow accumulation and reduced visibility',
        iconName: 'Snowflake',
        isDay,
      };
    case 80:
      return {
        code,
        label: 'Light Showers',
        description: 'Brief intermittent rain showers',
        iconName: 'CloudSunRain',
        isDay,
      };
    case 81:
    case 82:
      return {
        code,
        label: 'Heavy Showers',
        description: 'Sudden intense rain showers',
        iconName: 'CloudRain',
        isDay,
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Scattered burst of snow flurries',
        iconName: 'CloudSnow',
        isDay,
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning activity with sudden wind gusts',
        iconName: 'CloudLightning',
        isDay,
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Storm & Hail',
        description: 'Severe thunderstorm accompanied by hail',
        iconName: 'CloudHail',
        isDay,
      };
    default:
      return {
        code,
        label: 'Clear',
        description: 'Fair atmospheric conditions',
        iconName: isDay ? 'Sun' : 'Moon',
        isDay,
      };
  }
}

/**
 * Searches for cities using Open-Meteo's Geocoding API.
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error (${response.status})`);
    }
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error('Failed to search cities:', err);
    return [];
  }
}

/**
 * Reverse geocodes latitude/longitude into a city name via Open-Meteo or BigDataCloud fallback.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocation> {
  try {
    // Open-Meteo doesn't have a dedicated reverse endpoint, so we fetch nearby or use OpenStreetMap Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'WeatherIntelligenceApp/1.0',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.village ||
        addr.county ||
        data.display_name?.split(',')[0] ||
        'My Location';

      return {
        id: Math.floor(latitude * 1000 + longitude),
        name: cityName,
        latitude,
        longitude,
        country: addr.country,
        country_code: addr.country_code?.toUpperCase(),
        admin1: addr.state || addr.region,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, using coordinates name:', e);
  }

  return {
    id: 1,
    name: 'Current Location',
    latitude,
    longitude,
  };
}

/**
 * Fetches comprehensive weather data from Open-Meteo for a given location.
 */
export async function fetchWeatherData(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo returned status ${response.status}`);
  }

  const raw = await response.json();
  const timezone = raw.timezone || 'UTC';

  // Process current weather
  const cur = raw.current;
  const currentCondition = getWeatherCondition(cur.weather_code, cur.is_day === 1);

  const currentWeather = {
    time: cur.time,
    temperature: Math.round(cur.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(cur.apparent_temperature * 10) / 10,
    relativeHumidity: Math.round(cur.relative_humidity_2m),
    precipitation: cur.precipitation,
    weatherCode: cur.weather_code,
    surfacePressure: Math.round(cur.surface_pressure),
    windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
    windDirection: Math.round(cur.wind_direction_10m),
    windGusts: Math.round(cur.wind_gusts_10m * 10) / 10,
    uvIndex: Math.round((cur.uv_index || 0) * 10) / 10,
    isDay: cur.is_day === 1,
    condition: currentCondition,
  };

  // Process hourly (next 24 hours starting from current local hour)
  const hourlyTimes: string[] = raw.hourly.time;
  const nowIsoHour = cur.time.slice(0, 13); // "YYYY-MM-DDTHH"
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(nowIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24 = hourlyTimes.slice(startIndex, startIndex + 24);
  const hourly: HourlyForecastItem[] = next24.map((timeStr, idx) => {
    const actualIndex = startIndex + idx;
    const isDay = raw.hourly.is_day[actualIndex] === 1;
    const code = raw.hourly.weather_code[actualIndex];
    const condition = getWeatherCondition(code, isDay);

    const dateObj = new Date(timeStr);
    const hour = dateObj.getHours();
    const formattedTime =
      idx === 0
        ? 'Now'
        : `${hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}`;

    return {
      time: timeStr,
      formattedTime,
      isCurrentHour: idx === 0,
      temperature: Math.round(raw.hourly.temperature_2m[actualIndex] * 10) / 10,
      apparentTemperature: Math.round(raw.hourly.apparent_temperature[actualIndex] * 10) / 10,
      precipitationProbability: Math.round(raw.hourly.precipitation_probability[actualIndex] || 0),
      precipitation: Math.round((raw.hourly.precipitation[actualIndex] || 0) * 10) / 10,
      weatherCode: code,
      isDay,
      condition,
    };
  });

  // Process 7-day forecast
  const dailyTimes: string[] = raw.daily.time;
  const todayStr = cur.time.slice(0, 10);

  const daily: DailyForecastItem[] = dailyTimes.slice(0, 7).map((dateStr, idx) => {
    const code = raw.daily.weather_code[idx];
    const condition = getWeatherCondition(code, true);

    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isToday = dateStr === todayStr || idx === 0;
    const dayName = isToday ? 'Today' : dayNames[dateObj.getDay()];

    const fullDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      date: dateStr,
      dayName,
      fullDate,
      isToday,
      weatherCode: code,
      temperatureMax: Math.round(raw.daily.temperature_2m_max[idx]),
      temperatureMin: Math.round(raw.daily.temperature_2m_min[idx]),
      apparentTemperatureMax: Math.round(raw.daily.apparent_temperature_max[idx]),
      apparentTemperatureMin: Math.round(raw.daily.apparent_temperature_min[idx]),
      precipitationSum: Math.round(raw.daily.precipitation_sum[idx] * 10) / 10,
      precipitationProbabilityMax: Math.round(raw.daily.precipitation_probability_max[idx] || 0),
      windSpeedMax: Math.round(raw.daily.wind_speed_10m_max[idx]),
      uvIndexMax: Math.round((raw.daily.uv_index_max[idx] || 0) * 10) / 10,
      sunrise: raw.daily.sunrise[idx]?.slice(11, 16) || '',
      sunset: raw.daily.sunset[idx]?.slice(11, 16) || '',
      condition,
    };
  });

  // Generate Weather Intelligence & Planning Recommendations
  const intelligence = generateWeatherIntelligence({
    current: currentWeather,
    hourly,
    daily,
    location,
  });

  return {
    location,
    current: currentWeather,
    hourly,
    daily,
    intelligence,
    fetchedAt: new Date().toISOString(),
    timezone,
  };
}

export const POPULAR_CITIES: GeoLocation[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7143,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0772,
    longitude: 55.3093,
    country: 'United Arab Emirates',
    country_code: 'AE',
    admin1: 'Dubai',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.2897,
    longitude: 103.8501,
    country: 'Singapore',
    country_code: 'SG',
  },
];
