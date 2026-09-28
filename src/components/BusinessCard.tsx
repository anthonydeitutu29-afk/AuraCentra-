import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star,
  Check,
  Bookmark,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Laptop,
  Building2
} from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  isSaved = false,
  onToggleSave,
  onSelect 
}) => {
  const cleanPhone = business.phone ? business.phone.replace(/[^0-9+]/g, '') : '';
  const whatsappNum = business.whatsapp 
    ? business.whatsapp.replace(/[^0-9]/g, '') 
    : cleanPhone.replace(/[^0-9]/g, '');

  const fallbackImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
  const displayImage = business.cover_image || business.logo_url || fallbackImage;

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('food') || c.includes('restaurant')) return <UtensilsCrossed className="w-3 h-3 text-slate-500" />;
    if (c.includes('fashion') || c.includes('beauty')) return <ShoppingBag className="w-3 h-3 text-slate-500" />;
    if (c.includes('auto') || c.includes('transport')) return <Car className="w-3 h-3 text-slate-500" />;
    if (c.includes('electronic') || c.includes('gadget') || c.includes('tech')) return <Laptop className="w-3 h-3 text-slate-500" />;
    return <Building2 className="w-3 h-3 text-slate-500" />;
  };

  const displayRating = business.rating || 4.7;
  const displayReviews = business.reviews_count || 85;

  return (
    <div 
      onClick={() => onSelect && onSelect(business)}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Cover Image with Badges matching Image 1 */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img 
            src={displayImage} 
            alt={business.name} 
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />

          {/* Top Left: Verified Green Pill Badge matching Image 1 */}
          {business.verified && (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs backdrop-blur-xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Verified</span>
            </div>
          )}

          {/* Top Right: Bookmark Heart/Save Button matching Image 1 */}
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(business.id);
              }}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isSaved ? 'Saved' : 'Save business'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
            </button>
          )}
        </div>

        {/* Card Body matching Image 1 */}
        <div className="p-3.5 space-y-1.5 text-left">
          
          {/* Business Name */}
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-snug line-clamp-1">
            {business.name}
          </h3>

          {/* Category */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {getCategoryIcon(business.category)}
            <span className="truncate">{business.category}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{business.city || business.region}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs pt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{displayRating.toFixed(1)}</span>
            <span className="text-slate-400 text-[11px]">({displayReviews} reviews)</span>
          </div>

        </div>
      </div>

      {/* Action Buttons: [ Call ] (blue) and [ WhatsApp ] (green) matching Image 1 */}
      <div className="p-3.5 pt-0 grid grid-cols-2 gap-2">
        <a
          href={cleanPhone ? `tel:${cleanPhone}` : '#'}
          onClick={(e) => {
            e.stopPropagation();
            if (!cleanPhone) e.preventDefault();
          }}
          className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          title={`Call ${business.name}`}
        >
          <Phone className="w-3 h-3 fill-white" />
          <span>Call</span>
        </a>

        <a
          href={whatsappNum ? `https://wa.me/${whatsappNum}?text=Hello%20${encodeURIComponent(business.name)},%20I%20found%20your%20business%20on%20AuraCentra.` : '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            if (!whatsappNum) e.preventDefault();
          }}
          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
          title={`Chat with ${business.name} on WhatsApp`}
        >
          <MessageSquare className="w-3 h-3 fill-white" />
          <span>WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
