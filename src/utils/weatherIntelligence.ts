import {
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  GeoLocation,
  WeatherIntelligenceData,
  PlanningRecommendation,
  ActivityWindow,
} from '../types/weather';

interface IntelligenceInput {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  location: GeoLocation;
}

export function generateWeatherIntelligence(input: IntelligenceInput): WeatherIntelligenceData {
  const { current, hourly, daily, location } = input;
  const today = daily[0];

  // 1. Evaluate Umbrella Requirement
  const maxRainChanceToday = today?.precipitationProbabilityMax || 0;
  const currentPrecip = current.precipitation;
  const next8HoursRain = hourly.slice(0, 8).reduce((acc, h) => Math.max(acc, h.precipitationProbability), 0);

  let umbrellaNeeded: 'none' | 'possible' | 'recommended' | 'essential' = 'none';
  let umbrellaText = 'Dry skies expected; no umbrella required today.';

  if (currentPrecip > 0 || current.weatherCode >= 61 && current.weatherCode <= 65 || current.weatherCode >= 95) {
    umbrellaNeeded = 'essential';
    umbrellaText = 'Active precipitation underway — waterproof gear and umbrella essential.';
  } else if (next8HoursRain >= 65 || maxRainChanceToday >= 70) {
    umbrellaNeeded = 'essential';
    umbrellaText = `High rain likelihood (${Math.max(next8HoursRain, maxRainChanceToday)}%) — carry an umbrella and wear water-resistant shoes.`;
  } else if (next8HoursRain >= 35 || maxRainChanceToday >= 40) {
    umbrellaNeeded = 'recommended';
    umbrellaText = `Scattered showers possible (${Math.max(next8HoursRain, maxRainChanceToday)}%) — keeping a compact umbrella handy is recommended.`;
  } else if (next8HoursRain >= 15 || maxRainChanceToday >= 20) {
    umbrellaNeeded = 'possible';
    umbrellaText = 'Low chance of passing drizzle; an umbrella is optional but good for peace of mind.';
  }

  // 2. Clothing & Layering
  const temp = current.temperature;
  const wind = current.windSpeed;
  let clothingTitle = 'Comfortable Attire';
  let clothingAdvice = 'Light layers with standard comfortable casualwear.';
  let clothingDetail = 'Ideal balance of ambient warmth and gentle air movement.';
  let clothingStatus: PlanningRecommendation['status'] = 'positive';

  if (temp < 0) {
    clothingTitle = 'Heavy Winter Gear';
    clothingAdvice = 'Thermal base layers, heavy insulated coat, warm gloves, and knit hat.';
    clothingDetail = `Sub-zero conditions at ${temp}°C with wind chill making it feel colder.`;
    clothingStatus = 'alert';
  } else if (temp < 10) {
    clothingTitle = 'Warm Outer Layers';
    clothingAdvice = 'Insulated jacket or wool coat, layered knit sweater, and long pants.';
    clothingDetail = `Crisp and chilly at ${temp}°C — retain body heat when outdoors.`;
    clothingStatus = 'warning';
  } else if (temp < 18) {
    clothingTitle = 'Light Jacket / Sweater';
    clothingAdvice = 'Medium-weight hoodie, denim jacket, or cardigan over a breathable shirt.';
    clothingDetail = `Pleasantly cool at ${temp}°C, perfect for brisk strolling or light layering.`;
    clothingStatus = 'neutral';
  } else if (temp <= 27) {
    clothingTitle = 'Short Sleeves & Breathable';
    clothingAdvice = 'T-shirt, lightweight chinos or shorts, and breathable sneakers.';
    clothingDetail = `Warm and pleasant at ${temp}°C with favorable ambient comfort.`;
    clothingStatus = 'positive';
  } else {
    clothingTitle = 'Heat-Safe Lightweight Linens';
    clothingAdvice = 'Loose-fitting linen or moisture-wicking shirts, sunglasses, and sun hat.';
    clothingDetail = `High temperature of ${temp}°C — stay hydrated and seek shaded spots.`;
    clothingStatus = 'alert';
  }

  if (wind > 35) {
    clothingAdvice += ' Add a windbreaker shell to counter brisk gusts.';
  }

  // 3. Outdoor Fitness & Exercise Suitability
  let fitnessTitle = 'Outdoor Exercise';
  let fitnessAdvice = 'Great conditions for running, cycling, or brisk walking.';
  let fitnessDetail = 'Favorable atmospheric conditions with clean air and mild temperatures.';
  let fitnessStatus: PlanningRecommendation['status'] = 'positive';

  if (current.weatherCode >= 95) {
    fitnessTitle = 'Postpone Outdoor Workouts';
    fitnessAdvice = 'Thunderstorm hazard: exercise indoors at a gym or home studio.';
    fitnessDetail = 'Lightning risk and sudden gusts make outdoor activities unsafe.';
    fitnessStatus = 'alert';
  } else if (current.weatherCode >= 63 || current.weatherCode === 65 || current.weatherCode >= 73) {
    fitnessTitle = 'Wet / Slippery Conditions';
    fitnessAdvice = 'Heavy precipitation — indoor training strongly suggested.';
    fitnessDetail = 'Slick pavement, poor traction, and reduced visibility.';
    fitnessStatus = 'alert';
  } else if (temp > 32) {
    fitnessTitle = 'Midday Heat Caution';
    fitnessAdvice = 'Limit vigorous exertion; schedule workouts for early dawn or post-sunset.';
    fitnessDetail = 'Elevated heat stress risk — hydrate frequently with electrolytes.';
    fitnessStatus = 'warning';
  } else if (wind > 45) {
    fitnessTitle = 'Brisk Winds Advisory';
    fitnessAdvice = 'Cycling or hill sprints may face intense aerodynamic resistance.';
    fitnessDetail = `Sustained winds of ${wind} km/h with gusts up to ${current.windGusts} km/h.`;
    fitnessStatus = 'warning';
  }

  // 4. Commute & Transit
  let commuteTitle = 'Daily Commute';
  let commuteAdvice = 'Normal transit conditions with clear road visibility.';
  let commuteDetail = 'Standard travel times expected on major transit corridors.';
  let commuteStatus: PlanningRecommendation['status'] = 'positive';

  if (current.weatherCode === 45 || current.weatherCode === 48) {
    commuteTitle = 'Fog & Low Visibility';
    commuteAdvice = 'Use low-beam headlights and maintain wider braking distance.';
    commuteDetail = 'Dense fog reducing sight distance on highways and bridges.';
    commuteStatus = 'warning';
  } else if (current.weatherCode >= 61 && current.weatherCode <= 67) {
    commuteTitle = 'Wet Roads & Splashes';
    commuteAdvice = 'Allow an extra 10–15 minutes travel time for slippery roadways.';
    commuteDetail = 'Hydroplaning hazard on highways; surface runoff at intersections.';
    commuteStatus = 'warning';
  } else if (current.weatherCode >= 71) {
    commuteTitle = 'Snow & Ice Hazard';
    commuteAdvice = 'Exercise extreme caution; winter tires or transit recommended.';
    commuteDetail = 'Pavement glaze and slush accumulation impairing braking.';
    commuteStatus = 'alert';
  } else if (wind > 40) {
    commuteTitle = 'Crosswind Advisory';
    commuteAdvice = 'Hold steering firmly on elevated overpasses and bridges.';
    commuteDetail = `Gusts of ${current.windGusts} km/h can displace tall vehicles and two-wheelers.`;
    commuteStatus = 'warning';
  }

  // 5. Sun & UV Protection
  const uv = current.uvIndex;
  let sunTitle = 'UV & Sun Exposure';
  let sunAdvice = 'Minimal UV hazard; sunglasses optional for glare.';
  let sunDetail = 'UV index is low. Safe for extended unprotected sun exposure.';
  let sunStatus: PlanningRecommendation['status'] = 'positive';

  if (uv >= 8) {
    sunTitle = 'Very High UV Warning';
    sunAdvice = 'Apply SPF 50+ sunscreen, wear UV-blocking shades, and seek midday shade.';
    sunDetail = `UV index of ${uv} can cause sunburn in under 15 minutes of direct exposure.`;
    sunStatus = 'alert';
  } else if (uv >= 6) {
    sunTitle = 'High UV Index';
    sunAdvice = 'Apply broad-spectrum SPF 30+ and cover shoulders during peak sunlight.';
    sunDetail = `UV index is ${uv}. Midday sun between 11 AM and 4 PM requires skin protection.`;
    sunStatus = 'warning';
  } else if (uv >= 3) {
    sunTitle = 'Moderate UV Index';
    sunAdvice = 'Wear sunglasses and apply light sunscreen if outdoors for over an hour.';
    sunDetail = `UV index is ${uv}. Moderate solar intensity during cloud breaks.`;
    sunStatus = 'neutral';
  }

  // 6. Calculate Best Outdoor Activity Window in Next 18 Hours
  const daylightHours = hourly.slice(0, 18).filter((h) => h.isDay);
  let bestWindow: ActivityWindow | null = null;

  if (daylightHours.length > 0) {
    // Score each hour: ideal temp 16-24, rain 0, wind < 20
    const scored = daylightHours.map((item) => {
      let score = 100;
      // Temp penalty
      const tempDiff = Math.abs(item.temperature - 20);
      score -= tempDiff * 2.5;
      // Rain penalty
      score -= item.precipitationProbability * 0.8;
      if (item.precipitation > 0) score -= 35;
      // Bad weather codes
      if (item.weatherCode >= 95) score -= 60;
      else if (item.weatherCode >= 61) score -= 40;
      else if (item.weatherCode >= 51) score -= 20;

      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0]?.item;

    if (top) {
      let quality: ActivityWindow['quality'] = 'Good';
      if (top.precipitationProbability < 15 && top.temperature >= 16 && top.temperature <= 24) {
        quality = 'Optimal';
      } else if (top.precipitationProbability > 40 || top.temperature < 5 || top.temperature > 30) {
        quality = 'Fair';
      }

      bestWindow = {
        startTime: top.formattedTime,
        endTime: `+2 hrs`,
        temperature: top.temperature,
        summary: `${top.condition.label}, ${top.precipitationProbability}% rain chance`,
        quality,
      };
    }
  }

  // 7. Weekly Forecast Highlights
  const weeklyInsights: string[] = [];

  // Wettest day
  const rainiestDay = [...daily].sort(
    (a, b) => (b.precipitationSum || 0) - (a.precipitationSum || 0)
  )[0];
  if (rainiestDay && rainiestDay.precipitationSum > 2) {
    weeklyInsights.push(
      `Heaviest rain anticipated on ${rainiestDay.dayName} (~${rainiestDay.precipitationSum} mm with ${rainiestDay.precipitationProbabilityMax}% chance).`
    );
  } else {
    weeklyInsights.push('Predominantly dry and stable precipitation patterns across the next 7 days.');
  }

  // Warmest vs coolest day
  const warmestDay = [...daily].sort((a, b) => b.temperatureMax - a.temperatureMax)[0];
  const coolestDay = [...daily].sort((a, b) => a.temperatureMin - b.temperatureMin)[0];

  if (warmestDay && coolestDay) {
    weeklyInsights.push(
      `Weekly high reaching ${warmestDay.temperatureMax}°C on ${warmestDay.dayName}; overnight lows dipping to ${coolestDay.temperatureMin}°C on ${coolestDay.dayName}.`
    );
  }

  // Weekend outlook
  const weekendDays = daily.filter((d) => d.dayName === 'Sat' || d.dayName === 'Sun');
  if (weekendDays.length > 0) {
    const avgWeekendTemp = Math.round(
      weekendDays.reduce((sum, d) => sum + d.temperatureMax, 0) / weekendDays.length
    );
    const maxWeekendRain = Math.max(...weekendDays.map((d) => d.precipitationProbabilityMax));
    weeklyInsights.push(
      `Weekend Outlook: Highs around ${avgWeekendTemp}°C with ${
        maxWeekendRain > 40 ? 'chance of passing showers' : 'favorable outdoor conditions'
      }.`
    );
  }

  // Overall Headline
  let headline = `Comfortable conditions across ${location.name}`;
  let overallSummary = `${current.condition.label} with current temperature of ${current.temperature}°C. Wind steady at ${current.windSpeed} km/h.`;

  if (current.weatherCode >= 95) {
    headline = `Storm Watch Active in ${location.name}`;
    overallSummary = 'Thunderstorms detected. Remain alert for rapid wind shifts and flash rainfall.';
  } else if (current.precipitation > 0 || current.weatherCode >= 61) {
    headline = `Rainfall Underway in ${location.name}`;
    overallSummary = `Expect continued wet conditions with ${current.condition.label.toLowerCase()} through parts of the day.`;
  } else if (temp > 30) {
    headline = `Warm & Sunny Day in ${location.name}`;
    overallSummary = `Hot temperatures peaking at ${today?.temperatureMax ?? temp}°C. High UV index warrants sun protection.`;
  } else if (temp < 5) {
    headline = `Brisk & Chilly Climate in ${location.name}`;
    overallSummary = `Crisp cold conditions with current readings of ${temp}°C. Bundle up for outdoor plans.`;
  }

  const recommendations: PlanningRecommendation[] = [
    {
      category: 'umbrella',
      title: 'Umbrella Meter',
      status:
        umbrellaNeeded === 'essential'
          ? 'alert'
          : umbrellaNeeded === 'recommended'
          ? 'warning'
          : umbrellaNeeded === 'possible'
          ? 'neutral'
          : 'positive',
      advice: umbrellaText,
      detail: `Max rain probability today: ${maxRainChanceToday}%`,
      icon: 'Umbrella',
    },
    {
      category: 'clothing',
      title: clothingTitle,
      status: clothingStatus,
      advice: clothingAdvice,
      detail: clothingDetail,
      icon: 'Shirt',
    },
    {
      category: 'fitness',
      title: fitnessTitle,
      status: fitnessStatus,
      advice: fitnessAdvice,
      detail: fitnessDetail,
      icon: 'Activity',
    },
    {
      category: 'commute',
      title: commuteTitle,
      status: commuteStatus,
      advice: commuteAdvice,
      detail: commuteDetail,
      icon: 'Car',
    },
    {
      category: 'sun',
      title: sunTitle,
      status: sunStatus,
      advice: sunAdvice,
      detail: sunDetail,
      icon: 'SunMedium',
    },
  ];

  return {
    overallSummary,
    headline,
    umbrellaNeeded,
    umbrellaText,
    bestWindow,
    recommendations,
    weeklyInsights,
  };
}
