import { PopularityTrendData } from '../types';

// 30 Days of realistic search & customer engagement trends in Ghana (Accra, Kumasi, Takoradi, Tamale)
export const GHANA_POPULARITY_TRENDS_30D: PopularityTrendData[] = [
  { day: 'Day 1', date: 'Day 1', technology: 420, digitalMarketing: 380, hospitality: 510, healthcare: 290, fashion: 340, realEstate: 260, agriTech: 180 },
  { day: 'Day 3', date: 'Day 3', technology: 440, digitalMarketing: 395, hospitality: 530, healthcare: 305, fashion: 355, realEstate: 275, agriTech: 195 },
  { day: 'Day 6', date: 'Day 6', technology: 465, digitalMarketing: 420, hospitality: 590, healthcare: 310, fashion: 390, realEstate: 290, agriTech: 210 },
  { day: 'Day 9', date: 'Day 9', technology: 490, digitalMarketing: 445, hospitality: 560, healthcare: 330, fashion: 380, realEstate: 310, agriTech: 225 },
  { day: 'Day 12', date: 'Day 12', technology: 530, digitalMarketing: 480, hospitality: 620, healthcare: 345, fashion: 410, realEstate: 330, agriTech: 240 },
  { day: 'Day 15', date: 'Day 15', technology: 580, digitalMarketing: 510, hospitality: 680, healthcare: 360, fashion: 435, realEstate: 350, agriTech: 270 },
  { day: 'Day 18', date: 'Day 18', technology: 620, digitalMarketing: 550, hospitality: 640, healthcare: 380, fashion: 460, realEstate: 375, agriTech: 290 },
  { day: 'Day 21', date: 'Day 21', technology: 670, digitalMarketing: 595, hospitality: 710, healthcare: 400, fashion: 490, realEstate: 395, agriTech: 320 },
  { day: 'Day 24', date: 'Day 24', technology: 730, digitalMarketing: 640, hospitality: 750, healthcare: 425, fashion: 520, realEstate: 420, agriTech: 350 },
  { day: 'Day 27', date: 'Day 27', technology: 790, digitalMarketing: 690, hospitality: 790, healthcare: 450, fashion: 560, realEstate: 440, agriTech: 390 },
  { day: 'Day 30', date: 'Today', technology: 860, digitalMarketing: 760, hospitality: 840, healthcare: 480, fashion: 610, realEstate: 470, agriTech: 430 },
];

export interface SectorInsight {
  sector: string;
  key: keyof Omit<PopularityTrendData, 'day' | 'date'>;
  color: string;
  growthPercentage: string;
  monthlySearches: string;
  hotspots: string[];
  trendAnalysis: string;
}

export const SECTOR_INSIGHTS: SectorInsight[] = [
  {
    sector: 'Technology & Software',
    key: 'technology',
    color: '#0088FF',
    growthPercentage: '+104.7%',
    monthlySearches: '24.8K',
    hotspots: ['Accra Central', 'East Legon', 'Kumasi Tech City'],
    trendAnalysis: 'Fintech software, AI business tools, and verified IT hardware technicians lead enterprise search volume across Greater Accra.'
  },
  {
    sector: 'Digital Marketing & Business Hub',
    key: 'digitalMarketing',
    color: '#8B5CF6',
    growthPercentage: '+100.0%',
    monthlySearches: '21.5K',
    hotspots: ['Airport Residential', 'Osu Oxford St', 'Tema'],
    trendAnalysis: "Rapid acceleration in demand for SEO, branding, social commerce campaigns, and business registration advisory."
  },
  {
    sector: 'Hospitality & Restaurants',
    key: 'hospitality',
    color: '#F59E0B',
    growthPercentage: '+64.7%',
    monthlySearches: '28.2K',
    hotspots: ['Cantonments', 'Labone', 'Ahodwo Kumasi'],
    trendAnalysis: 'Weekend dining, rooftop lounges, and continental catering searches continue strong upward momentum.'
  },
  {
    sector: 'Fashion & Bespoke Tailoring',
    key: 'fashion',
    color: '#EC4899',
    growthPercentage: '+79.4%',
    monthlySearches: '18.1K',
    hotspots: ['Adabraka', 'Osu', 'Bantama Kumasi'],
    trendAnalysis: 'Modern Afrocentric couture, bespoke bridal Kente weaving, and export-ready African garments.'
  },
  {
    sector: 'Healthcare & Pharmacies',
    key: 'healthcare',
    color: '#10B981',
    growthPercentage: '+65.5%',
    monthlySearches: '14.3K',
    hotspots: ['Dzorwulu', 'Ridge', 'Asokwa'],
    trendAnalysis: '24/7 licensed pharmacies, specialist diagnostics labs, and verified dental clinics seeing consistent daily lookup.'
  },
  {
    sector: 'Real Estate & Housing',
    key: 'realEstate',
    color: '#6366F1',
    growthPercentage: '+80.7%',
    monthlySearches: '13.9K',
    hotspots: ['Spintex', 'East Legon Hills', 'Kokrobite'],
    trendAnalysis: 'High interest in verified land title documentation, serviced apartments, and commercial co-working rentals.'
  },
  {
    sector: 'AgriTech & Modern Logistics',
    key: 'agriTech',
    color: '#14B8A6',
    growthPercentage: '+138.8%',
    monthlySearches: '11.2K',
    hotspots: ['Tamale Industrial', 'Sunyani', 'Tema Harbour'],
    trendAnalysis: 'Fastest growing sector in Q3: cold-chain logistics, agro-processing suppliers, and tractor-hiring networks.'
  }
];
