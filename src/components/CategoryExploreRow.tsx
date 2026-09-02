import React from 'react';
import { 
  Laptop, 
  UtensilsCrossed, 
  Heart, 
  Building, 
  GraduationCap, 
  Car, 
  Shirt, 
  Wrench, 
  MoreHorizontal, 
  ArrowRight,
  Building2
} from 'lucide-react';
import { Category } from '../types';

interface CategoryExploreRowProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onViewAllCategories: () => void;
}

export const CategoryExploreRow: React.FC<CategoryExploreRowProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onViewAllCategories,
}) => {
  // 8 standard featured categories matching Image 1 exactly
  const categoryIconsMap: Record<string, { label: string; icon: React.FC<{ className?: string }> }> = {
    technology: { label: 'Technology', icon: Laptop },
    tech: { label: 'Technology', icon: Laptop },
    restaurants: { label: 'Restaurants', icon: UtensilsCrossed },
    restaurant: { label: 'Restaurants', icon: UtensilsCrossed },
    food: { label: 'Restaurants', icon: UtensilsCrossed },
    healthcare: { label: 'Healthcare', icon: Heart },
    health: { label: 'Healthcare', icon: Heart },
    'real-estate': { label: 'Real Estate', icon: Building },
    realestate: { label: 'Real Estate', icon: Building },
    education: { label: 'Education', icon: GraduationCap },
    automotive: { label: 'Automotive', icon: Car },
    auto: { label: 'Automotive', icon: Car },
    fashion: { label: 'Fashion & Beauty', icon: Shirt },
    'fashion-beauty': { label: 'Fashion & Beauty', icon: Shirt },
    'home-services': { label: 'Home Services', icon: Wrench },
    services: { label: 'Home Services', icon: Wrench },
  };

  const defaultExploreList = [
    { id: 'technology', name: 'Technology', icon: Laptop },
    { id: 'restaurants', name: 'Restaurants', icon: UtensilsCrossed },
    { id: 'healthcare', name: 'Healthcare', icon: Heart },
    { id: 'real-estate', name: 'Real Estate', icon: Building },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'automotive', name: 'Automotive', icon: Car },
    { id: 'fashion-beauty', name: 'Fashion & Beauty', icon: Shirt },
    { id: 'home-services', name: 'Home Services', icon: Wrench },
  ];

  return (
    <section className="space-y-4" id="explore-categories-row-section">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Explore by category
        </h2>
        <button
          type="button"
          onClick={onViewAllCategories}
          className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
        >
          <span>View all categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Clean horizontal row of minimal cards matching Image 1 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {defaultExploreList.map((item) => {
          const matchingCategory = categories.find(
            (c) => c.id.toLowerCase().includes(item.id) || c.slug?.toLowerCase().includes(item.id) || c.name.toLowerCase() === item.name.toLowerCase()
          );
          const targetId = matchingCategory ? matchingCategory.id : item.id;
          const isSelected = selectedCategory === targetId;
          const IconComp = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? '' : targetId)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#155DFC] text-white border-[#155DFC] shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-black/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#155DFC] hover:shadow-xs'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                isSelected ? 'bg-blue-500 text-white' : 'bg-blue-50 dark:bg-blue-950/60 text-[#155DFC] dark:text-blue-400'
              }`}>
                <IconComp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-1">{item.name}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={onViewAllCategories}
          className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black/40 text-slate-800 dark:text-slate-200 hover:border-[#155DFC] hover:shadow-xs text-center transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-black/60 text-slate-500 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold leading-tight">More</span>
        </button>
      </div>
    </section>
  );
};
