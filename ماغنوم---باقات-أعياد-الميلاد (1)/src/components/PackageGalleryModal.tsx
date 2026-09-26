import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayPackage } from '../types';
import { EMBEDDED_PACKAGE_IMAGES } from '../data/embeddedMedia';

interface PackageGalleryModalProps {
  isOpen: boolean;
  pkg: BirthdayPackage | null;
  customImages: string[];
  onClose: () => void;
}

export const PackageGalleryModal: React.FC<PackageGalleryModalProps> = ({
  isOpen,
  pkg,
  customImages,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen || !pkg) return null;

  // Integrated Base64 photos or user custom photos
  const allImages = (customImages && customImages.length > 0)
    ? customImages
    : (EMBEDDED_PACKAGE_IMAGES[pkg.id] || []);
  const currentActive = Math.min(selectedIndex, Math.max(0, allImages.length - 1));

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between gap-3 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">{pkg.badgeEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    صور من تجهيزاتنا - {pkg.title}
                  </h3>
                  {allImages.length > 0 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {allImages.length} صور
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  معرض الصور الواقعية للتجهيزات في صالة MAGNUM (تظهر كاملة بالطول)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إغلاق ✕</span>
            </button>
          </div>

          {/* Main Photo Viewport - Full vertical portrait display */}
          <div className="relative flex-1 bg-stone-950 flex items-center justify-center min-h-[350px] sm:min-h-[520px] max-h-[65vh] overflow-hidden select-none">
            {allImages.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-5">
                {/* Background Ambient Glow using the image */}
                <img
                  src={allImages[currentActive]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none"
                />

                {/* Main Full-Height Vertical Image (object-contain with max constraints) */}
                <motion.img
                  key={currentActive}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={allImages[currentActive]}
                  alt={`تجهيزات ${pkg.title} - صورة ${currentActive + 1}`}
                  className="relative z-10 max-h-[58vh] sm:max-h-[62vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-stone-800"
                  referrerPolicy="no-referrer"
                />

                {/* Left / Right Nav Arrows if multiple */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-700 shadow-xl transition cursor-pointer active:scale-95"
                      title="الصورة السابقة"
                    >
                      <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-700 shadow-xl transition cursor-pointer active:scale-95"
                      title="الصورة التالية"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                    </button>
                  </>
                )}

                {/* Badge showing counter */}
                <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-lg bg-stone-900/90 border border-stone-700 text-xs text-stone-300 font-mono flex items-center gap-2">
                  <span>{currentActive + 1} / {allImages.length}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    صالة MAGNUM ✨
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  معرض صور تجهيزات {pkg.title}
                </h4>
                <p className="text-sm text-stone-400 max-w-sm mb-5 leading-relaxed">
                  تجهيزات وديكورات حصرية بأعلى درجات الفخامة والخصوصية في صالة MAGNUM.
                </p>
                <div className="px-4 py-2 rounded-2xl bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>تأكيد الحجز والتنسيق متاح مباشرة عبر الواتساب</span>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="p-3 sm:p-4 bg-stone-950/90 border-t border-stone-800 flex items-center gap-3 overflow-x-auto justify-center">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    currentActive === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-md'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`مصغرة ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
