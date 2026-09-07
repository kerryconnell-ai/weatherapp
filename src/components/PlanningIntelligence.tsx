import React, { useState } from 'react';
import {
  Sparkles,
  Umbrella,
  Shirt,
  Activity,
  Car,
  SunMedium,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { WeatherIntelligenceData, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/formatters';

interface PlanningIntelligenceProps {
  intelligence: WeatherIntelligenceData;
  unit: TemperatureUnit;
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({
  intelligence,
  unit,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const {
    overallSummary,
    headline,
    umbrellaNeeded,
    umbrellaText,
    bestWindow,
    recommendations,
    weeklyInsights,
  } = intelligence;

  // Filter recommendations
  const filteredRecs =
    activeCategory === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === activeCategory);

  const getStatusBadge = (status: 'positive' | 'warning' | 'alert' | 'neutral') => {
    switch (status) {
      case 'positive':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Optimal
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Caution
          </span>
        );
      case 'alert':
        return (
          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Advisory
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40">
            <Info className="w-3 h-3 mr-1" />
            Moderate
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'umbrella':
        return <Umbrella className="w-5 h-5 text-sky-400" />;
      case 'clothing':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'fitness':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'commute':
        return <Car className="w-5 h-5 text-amber-400" />;
      case 'sun':
        return <SunMedium className="w-5 h-5 text-orange-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  const getUmbrellaMeterLevel = (status: 'none' | 'possible' | 'recommended' | 'essential') => {
    switch (status) {
      case 'essential':
        return { percent: 100, label: 'Essential', color: 'bg-rose-500' };
      case 'recommended':
        return { percent: 65, label: 'Recommended', color: 'bg-amber-500' };
      case 'possible':
        return { percent: 30, label: 'Low Chance', color: 'bg-sky-500' };
      default:
        return { percent: 5, label: 'Not Needed', color: 'bg-emerald-500' };
    }
  };

  const umbrellaInfo = getUmbrellaMeterLevel(umbrellaNeeded);

  return (
    <section id="planning-intelligence-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Weather Intelligence & Planning
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Plans' },
            { id: 'umbrella', label: 'Umbrella' },
            { id: 'clothing', label: 'Attire' },
            { id: 'fitness', label: 'Fitness' },
            { id: 'commute', label: 'Commute' },
            { id: 'sun', label: 'UV Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeCategory === tab.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner: Intelligence Verdict & Best Window */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Overall Verdict */}
        <div className="md:col-span-7 bg-slate-800/80 rounded-xl border border-slate-700/70 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Daily Intelligence Verdict
              </span>
              <span className="text-[11px] text-slate-400">Real-time synthesis</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {overallSummary}
            </p>
          </div>

          {/* Umbrella Meter Bar */}
          <div className="mt-4 pt-3 border-t border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <Umbrella className="w-3.5 h-3.5 text-sky-400" />
                <span>Umbrella Need:</span>
                <span className="font-semibold text-white">{umbrellaInfo.label}</span>
              </div>
              <span className="text-slate-400 text-[11px]">{umbrellaInfo.percent}% Risk Index</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${umbrellaInfo.color} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.max(umbrellaInfo.percent, 6)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">{umbrellaText}</p>
          </div>
        </div>

        {/* Right: Best Outdoor Activity Window */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-800/90 to-slate-800/50 rounded-xl border border-slate-700/70 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Best Activity Window
              </span>
              {bestWindow && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bestWindow.quality === 'Optimal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {bestWindow.quality}
                </span>
              )}
            </div>

            {bestWindow ? (
              <div className="mt-3">
                <div className="text-2xl font-bold text-white tracking-tight">
                  {bestWindow.startTime}{' '}
                  <span className="text-sm font-normal text-slate-400">
                    ({bestWindow.endTime})
                  </span>
                </div>
                <div className="text-xs text-emerald-300 font-medium mt-1">
                  Expected {formatTemperature(bestWindow.temperature, unit)} • {bestWindow.summary}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  Optimal combination of comfortable ambient temperature, minimal precipitation risk, and gentle winds.
                </p>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400">
                Nighttime period or limited daylight window currently available.
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
            Computed from 24-hour Open-Meteo hourly curve
          </div>
        </div>
      </div>

      {/* Structured Planning Recommendations Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredRecs.map((rec, index) => (
          <div
            key={`${rec.category}-${index}`}
            className="bg-slate-800/70 hover:bg-slate-800/95 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(rec.category)}
                </div>
                {getStatusBadge(rec.status)}
              </div>

              <h4 className="text-sm font-bold text-slate-100">{rec.title}</h4>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                {rec.advice}
              </p>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-700/50">
              {rec.detail}
            </p>
          </div>
        ))}
      </div>

      {/* 7-Day Planning Highlights Strip */}
      {weeklyInsights.length > 0 && (
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 p-3.5">
          <div className="flex items-center text-xs font-semibold text-slate-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 mr-1.5" />
            <span>7-Day Strategic Planning Insights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {weeklyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-slate-400 bg-slate-900/30 p-2.5 rounded-lg border border-slate-800"
              >
                <ChevronRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
