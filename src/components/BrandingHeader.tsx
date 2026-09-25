import React from 'react';

interface BrandingHeaderProps {
  onOpenBooking: () => void;
  onScrollToPackages: () => void;
  venueLogo?: string | null;
}

export const BrandingHeader: React.FC<BrandingHeaderProps> = ({
  onOpenBooking,
  onScrollToPackages,
  venueLogo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Magnum Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group shrink-0">
            {venueLogo ? (
              <img
                src={venueLogo}
                alt="لوجو MAGNUM"
                className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20 border border-amber-300">
                M
              </div>
            )}
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
            تأكيد الحجز المباشر 📱
          </button>
        </div>
      </div>
    </header>
  );
};
