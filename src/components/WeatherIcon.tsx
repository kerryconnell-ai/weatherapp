import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudHail,
  CloudSunRain,
  Snowflake,
  Wind,
  Umbrella,
  Shirt,
  Activity,
  Car,
  SunMedium,
  Compass,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Thermometer,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const iconProps = {
    className,
    size,
  };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-400`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-sky-400`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${className} text-sky-400`} />;
    case 'CloudSunRain':
      return <CloudSunRain {...iconProps} className={`${className} text-sky-300`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${className} text-blue-200`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`${className} text-blue-200`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-amber-400`} />;
    case 'CloudHail':
      return <CloudHail {...iconProps} className={`${className} text-cyan-300`} />;
    case 'Wind':
      return <Wind {...iconProps} className={`${className} text-teal-300`} />;
    case 'Umbrella':
      return <Umbrella {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'Activity':
      return <Activity {...iconProps} />;
    case 'Car':
      return <Car {...iconProps} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Gauge':
      return <Gauge {...iconProps} />;
    case 'Sunrise':
      return <Sunrise {...iconProps} />;
    case 'Sunset':
      return <Sunset {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Thermometer':
      return <Thermometer {...iconProps} />;
    default:
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
  }
};
