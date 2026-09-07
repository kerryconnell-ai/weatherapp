export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  country?: string;
  admin1?: string; // State or province
  admin2?: string; // County or district
  timezone?: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: string;
  isDay: boolean;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  weatherCode: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  isDay: boolean;
  condition: WeatherCondition;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  isCurrentHour: boolean;
  temperature: number;
  apparentTemperature?: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  condition: WeatherCondition;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  fullDate: string;
  isToday: boolean;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
}

export interface ActivityWindow {
  startTime: string;
  endTime: string;
  summary: string;
  temperature: number;
  quality: 'Optimal' | 'Good' | 'Fair' | 'Poor';
}

export interface PlanningRecommendation {
  category: 'clothing' | 'fitness' | 'commute' | 'sun' | 'umbrella';
  title: string;
  status: 'positive' | 'warning' | 'alert' | 'neutral';
  advice: string;
  detail: string;
  icon: string;
}

export interface WeatherIntelligenceData {
  overallSummary: string;
  headline: string;
  umbrellaNeeded: 'none' | 'possible' | 'recommended' | 'essential';
  umbrellaText: string;
  bestWindow: ActivityWindow | null;
  recommendations: PlanningRecommendation[];
  weeklyInsights: string[];
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  intelligence: WeatherIntelligenceData;
  fetchedAt: string;
  timezone: string;
}
