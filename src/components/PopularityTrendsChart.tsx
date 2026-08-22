import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Flame,
  Info
} from 'lucide-react';
import { GHANA_POPULARITY_TRENDS_30D, SECTOR_INSIGHTS } from '../data/trendsData';

interface PopularityTrendsChartProps {
  onSelectCategory?: (categorySlug: string) => void;
}

export const PopularityTrendsChart: React.FC<PopularityTrendsChartProps> = ({
  onSelectCategory,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [activeMetric, setActiveMetric] = useState<'all' | 'tech' | 'hospitality' | 'marketing' | 'agritech'>('all');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Filter data based on time range
  const displayData = React.useMemo(() => {
    if (timeRange === '7d') {
      return GHANA_POPULARITY_TRENDS_30D.slice(-4);
    }
    if (timeRange === '14d') {
      return GHANA_POPULARITY_TRENDS_30D.slice(-7);
    }
    return GHANA_POPULARITY_TRENDS_30D;
  }, [timeRange]);

  // Custom tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-800 text-xs z-50">
          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>{label}</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300">
              Ghana Index
            </span>
          </div>
          <div className="space-y-1.5 min-w-[170px]">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {entry.name}:
                  </span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {entry.value.toLocaleString()} searches
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      id="popularity-trends-section"
      className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-blue-100/90 dark:border-slate-800 shadow-sm p-4 sm:p-7 transition-all my-8"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-blue-50 dark:border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 text-xs font-bold mb-2 border border-blue-200/60 dark:border-blue-900/60">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Real-time Ghanaian Market Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Business Popularity Trends</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Last 30 Days
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium leading-relaxed">
            Search volume metrics, consumer discovery surges, and high-growth sectors across Accra, Kumasi, Takoradi, and regional markets.
          </p>
        </div>

        {/* Time Window Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-center">
          {(['7d', '14d', '30d'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '14d' ? '14 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="pt-6">
        <div className="h-[300px] sm:h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold"
                tickLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold"
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{
                  paddingBottom: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />

              {/* Lines for High Growth Sectors */}
              {(activeMetric === 'all' || activeMetric === 'tech') && (
                <Line
                  type="monotone"
                  dataKey="technology"
                  name="Tech & Software"
                  stroke="#0088FF"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                  activeDot={{ r: 7 }}
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'marketing') && (
                <Line
                  type="monotone"
                  dataKey="digitalMarketing"
                  name="Digital Marketing"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                  activeDot={{ r: 7 }}
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'hospitality') && (
                <Line
                  type="monotone"
                  dataKey="hospitality"
                  name="Hospitality & Dining"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 2, fill: '#FFFFFF' }}
                  activeDot={{ r: 6 }}
                />
              )}

              {activeMetric === 'all' && (
                <Line
                  type="monotone"
                  dataKey="fashion"
                  name="Fashion & Couture"
                  stroke="#EC4899"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, strokeWidth: 1.5, fill: '#FFFFFF' }}
                />
              )}

              {activeMetric === 'all' && (
                <Line
                  type="monotone"
                  dataKey="healthcare"
                  name="Healthcare"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1.5, fill: '#FFFFFF' }}
                />
              )}

              {(activeMetric === 'all' || activeMetric === 'agritech') && (
                <Line
                  type="monotone"
                  dataKey="agriTech"
                  name="AgriTech & Logistics"
                  stroke="#14B8A6"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, strokeWidth: 2, fill: '#FFFFFF' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Insight Cards Grid */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Sector Growth Breakdowns & Regional Hotspots
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Click any sector for market overview
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SECTOR_INSIGHTS.slice(0, 4).map((item) => (
            <div
              key={item.sector}
              onClick={() => setSelectedSector(selectedSector === item.sector ? null : item.sector)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                selectedSector === item.sector
                  ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-400 dark:border-blue-700 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.sector}
                  </h4>
                </div>
                <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md flex items-center shrink-0">
                  <ArrowUpRight className="w-3 h-3 inline" />
                  {item.growthPercentage}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>Monthly Searches</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {item.monthlySearches}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                {item.trendAnalysis}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-bold uppercase">Hotspots</span>
                <span className="text-blue-700 dark:text-cyan-300 font-semibold truncate max-w-[130px]">
                  {item.hotspots.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
