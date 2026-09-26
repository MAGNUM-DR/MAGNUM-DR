import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { safeGetLocalStorage } from '../utils/imageStorage';
import { MAGNUM_VENUE_LOGO_DATA_URL } from '../data/embeddedMedia';

interface BrandingHeaderProps {
  onOpenBooking: () => void;
  onScrollToPackages: () => void;
}

export const BrandingHeader: React.FC<BrandingHeaderProps> = ({
  onOpenBooking,
  onScrollToPackages,
}) => {
  const [magnumLogo] = useState<string>(() => {
    return safeGetLocalStorage('magnum_venue_logo') || MAGNUM_VENUE_LOGO_DATA_URL;
  });

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Magnum Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <img
              src={magnumLogo || MAGNUM_VENUE_LOGO_DATA_URL}
              alt="لوجو MAGNUM"
              className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black text-amber-400 tracking-wider font-serif">
                MAGNUM
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              أعياد ميلاد فاخرة ومناسبات لا تُنسى
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToPackages}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            تصفح الباقات 👑
          </button>
          
          <button
            onClick={onOpenBooking}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
          >
            احجز الآن 🎂
          </button>
        </div>
      </div>
    </header>
  );
};
