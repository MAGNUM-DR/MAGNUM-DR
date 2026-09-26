import React, { useState } from 'react';
import { MessageCircle, Phone, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { safeGetLocalStorage } from '../utils/imageStorage';
import { MAGNUM_VENUE_LOGO_DATA_URL, DESIGNER_LOGO_DATA_URL } from '../data/embeddedMedia';

interface DesignerFooterProps {
  onOpenBooking: () => void;
  onScrollToTop: () => void;
}

export const DesignerFooter: React.FC<DesignerFooterProps> = ({
  onOpenBooking,
  onScrollToTop,
}) => {
  const [designerLogo] = useState<string>(() => {
    return safeGetLocalStorage('designer_personal_logo') || DESIGNER_LOGO_DATA_URL;
  });

  const [venueLogo] = useState<string>(() => {
    return safeGetLocalStorage('magnum_venue_logo') || MAGNUM_VENUE_LOGO_DATA_URL;
  });

  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-300 pt-10 pb-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Brand & Designer Attribution Section */}
        <div className="p-6 rounded-3xl bg-stone-900/80 border-2 border-amber-500/30 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* 1. Magnum Venue Info */}
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-l border-stone-800 pb-5 md:pb-0 md:pl-6">
              <div className="relative group shrink-0">
                <img
                  src={venueLogo || MAGNUM_VENUE_LOGO_DATA_URL}
                  alt="لوجو صالة MAGNUM"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">صالة MAGNUM</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    المكان الرسمي
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  أرقى حفلات أعياد الميلاد والجلسات الملوكية، احتفالك يبدأ من MAGNUM.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href="tel:0930279675"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span className="font-mono font-bold tracking-wider">0930279675</span>
                  </a>

                  <a
                    href="https://wa.me/218930279675?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%B5%D8%A7%D9%84%D8%A9%20MAGNUM%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AD%D8%AC%D8%B2%20%D8%B9%D9%8A%D8%AF%20%D9%85%D9%8A%D9%84%D8%A7%D8%AF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition font-black"
                  >
                    <MessageCircle className="w-3 h-3 fill-stone-950" />
                    <span>واتساب MAGNUM</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Designer Recognition & System Developer: DR\ MOHAMED FARES */}
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={designerLogo || DESIGNER_LOGO_DATA_URL}
                  alt="لوجو المصمم"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-bold">تصميم وتطوير النظام:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                    حقوق معتمدة
                  </span>
                </div>
                <h5 className="text-lg font-black text-white mt-0.5 tracking-wide">
                  DR\ MOHAMED FARES
                </h5>

                {/* Direct Phone & WhatsApp */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href="tel:0943326462"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 transition"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span className="font-mono font-bold tracking-wider">0943326462</span>
                  </a>

                  <a
                    href="https://wa.me/218943326462?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20DR%5C%20MOHAMED%20FARES"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition font-bold"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>تواصل واتساب</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-stone-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-right">
          <p>© {new Date().getFullYear()} صالة MAGNUM - جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onScrollToTop}
              className="text-amber-400/80 hover:text-amber-300 transition cursor-pointer font-bold"
            >
              العودة للأعلى ⬆️
            </button>
            <span>•</span>
            <span className="text-stone-400 font-medium">تصميم: DR\ MOHAMED FARES (0943326462)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
