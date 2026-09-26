import React, { useState } from 'react';
import { BirthdayPackage } from '../types';
import { Check, Crown, Users, Palette, Info, MessageCircle, Eye, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { EMBEDDED_PACKAGE_IMAGES } from '../data/embeddedMedia';

interface PackageCardProps {
  pkg: BirthdayPackage;
  index: number;
  customImages?: string[];
  onBookNow: (pkg: BirthdayPackage, selectedColor?: string) => void;
  onOpenGallery: (pkg: BirthdayPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  index,
  customImages = [],
  onBookNow,
  onOpenGallery,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    pkg.colorOptions ? pkg.colorOptions[0] : undefined
  );
  const [customColorNote, setCustomColorNote] = useState('');

  const isVipHall = pkg.id === 'package-vip-hall';
  const isPackage1 = pkg.id === 'package-1';

  // Integrated Base64 photos or user custom photos
  const effectivePhotos = (customImages && customImages.length > 0)
    ? customImages
    : (EMBEDDED_PACKAGE_IMAGES[pkg.id] || []);
  const hasImages = effectivePhotos.length > 0;
  const coverImage = hasImages ? effectivePhotos[0] : null;
  const totalPhotos = effectivePhotos.length;

  return (
    <motion.div
      id={pkg.id}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay: index * 0.12,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: isVipHall
          ? '0 30px 65px -12px rgba(234, 179, 8, 0.4), 0 16px 35px -8px rgba(0, 0, 0, 0.95)'
          : isPackage1
          ? '0 30px 65px -12px rgba(245, 158, 11, 0.35), 0 16px 35px -8px rgba(0, 0, 0, 0.9)'
          : '0 30px 65px -12px rgba(0, 0, 0, 0.95), 0 16px 35px -8px rgba(245, 158, 11, 0.2)',
        borderColor: isVipHall
          ? 'rgba(234, 179, 8, 1)'
          : isPackage1
          ? 'rgba(245, 158, 11, 0.95)'
          : 'rgba(245, 158, 11, 0.6)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className={`relative flex flex-col justify-between rounded-3xl overflow-hidden border backdrop-blur-xl select-none transition-colors duration-300 ${
        isVipHall
          ? 'bg-gradient-to-b from-stone-900 via-stone-900/95 to-stone-950 border-amber-400 ring-2 ring-amber-400/40 shadow-2xl shadow-stone-950'
          : isPackage1
          ? 'bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-stone-950/95 border-amber-500/70 ring-2 ring-amber-500/40 shadow-2xl shadow-stone-950'
          : 'bg-stone-900/85 border-stone-800/90 shadow-xl shadow-stone-950/80'
      }`}
    >
      {/* Popular badge */}
      {isVipHall ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="absolute top-3.5 right-3.5 z-30 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/40"
        >
          <Crown className="w-3.5 h-3.5 fill-stone-950" />
          <span>حجز حصري - صالة VIP بالكامل</span>
        </motion.div>
      ) : isPackage1 ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="absolute top-3.5 right-3.5 z-30 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
        >
          <Crown className="w-3.5 h-3.5 fill-stone-950" />
          <span>الأكثر طلباً وفخامة</span>
        </motion.div>
      ) : null}

      <div>
        {/* Real Photography Card Image Frame - Full Portrait Display (الصورة كاملة بالطول) */}
        {hasImages && coverImage ? (
          <div
            onClick={() => onOpenGallery(pkg)}
            className="relative w-full aspect-[3/4] max-h-[460px] overflow-hidden bg-stone-950 group cursor-pointer border-b border-stone-800/80 flex items-center justify-center"
          >
            {/* Ambient blur of the portrait image */}
            <img
              src={coverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
            />

            {/* Main picture displayed completely in full height (object-contain) */}
            <img
              src={coverImage}
              alt={pkg.title}
              className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-102"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Subtle gradient edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none z-10" />

            {/* Button: "صور من تجهيزاتنا" */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery(pkg);
              }}
              className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer z-20"
            >
              <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>صور من تجهيزاتنا ({totalPhotos})</span>
            </button>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
              <span className="px-4 py-2 rounded-2xl bg-stone-950/90 text-amber-300 text-xs font-bold border border-amber-500/50 shadow-2xl flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>اضغط لتكبير واستعراض صور التجهيزات 📸</span>
              </span>
            </div>
          </div>
        ) : (
          /* Elegant Luxury MAGNUM Card Header */
          <div className="relative w-full aspect-[4/5] max-h-[300px] bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-950 flex flex-col items-center justify-center p-6 text-center border-b border-stone-800/80 group overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3.5 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-3xl">{pkg.badgeEmoji}</span>
              </div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-serif mb-1">
                MAGNUM VIP LOUNGE
              </span>
              <h4 className="text-base font-black text-white mb-2">
                تجهيزات {pkg.title}
              </h4>
              <p className="text-xs text-stone-400 max-w-[240px] leading-relaxed">
                {pkg.tagline}
              </p>

              <div className="mt-4 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-amber-500/20 text-amber-300/90 text-[11px] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>أعلى معايير الفخامة والخصوصية</span>
              </div>
            </div>
          </div>
        )}

        {/* Card Content Details */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pkg.badgeEmoji}</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-800/90 text-amber-300 border border-stone-700">
                {pkg.badge}
              </span>
            </div>
            {pkg.guestCount && (
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1 bg-stone-950/60 px-2.5 py-1 rounded-lg border border-stone-800">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {typeof pkg.guestCount === 'number'
                    ? `حتى ${pkg.guestCount} أشخاص`
                    : pkg.guestCount}
                </span>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
            {pkg.title}
          </h3>

          <p className="text-xs text-stone-400 mb-5 leading-relaxed">
            {pkg.subtitle}
          </p>

          {/* Pricing Highlight */}
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/90 mb-5 flex items-baseline justify-between">
            <span className="text-xs font-bold text-stone-400">سعر الباقة الإجمالي:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 font-mono">
                {pkg.price}
              </span>
              <span className="text-xs font-bold text-amber-400/90">
                {pkg.currency}
              </span>
            </div>
          </div>

          {/* Color Selector if available */}
          {pkg.hasColorChoice && pkg.colorOptions && (
            <div className="mb-5 p-3 rounded-2xl bg-stone-950/40 border border-stone-800/60">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>اختيار لون / ثيم الديكور:</span>
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono font-bold">
                  (مشمول مجاناً)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {pkg.colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`text-right text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedColor === c
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold shadow-sm'
                        : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <span>{c}</span>
                    {selectedColor === c && (
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Color Input if "اختيار لون على ذوقك" is selected */}
              {selectedColor?.includes('اختيار لون على ذوقك') && (
                <div className="mt-2.5 pt-2 border-t border-stone-800">
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    اكتب اللون أو الثيم المطلوب بالتحديد:
                  </label>
                  <input
                    type="text"
                    value={customColorNote}
                    onChange={(e) => setCustomColorNote(e.target.value)}
                    placeholder="مثال: أبيض ولؤلؤي مع لمسات ذهبية..."
                    className="w-full text-xs px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500/50 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Features List */}
          <div className="space-y-2 mb-6">
            <span className="text-[11px] font-black text-amber-400/90 tracking-wider uppercase block">
              المزايا والمواصفات المشمولة:
            </span>
            <ul className="space-y-2">
              {pkg.features.map((feat, i) => (
                <li key={i} className="text-xs text-stone-300 flex items-start gap-2 leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-5 sm:p-6 pt-0 mt-auto">
        <button
          type="button"
          onClick={() => {
            const finalColor = selectedColor?.includes('اختيار لون على ذوقك') && customColorNote.trim()
              ? `اختيار لون على ذوقك (${customColorNote.trim()})`
              : selectedColor;
            onBookNow(pkg, finalColor);
          }}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all duration-300 cursor-pointer active:scale-98 ${
            isVipHall
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-stone-950 shadow-amber-500/30'
              : isPackage1
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 shadow-amber-500/25'
              : 'bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white border border-stone-700 hover:border-amber-500/50'
          }`}
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>تأكيد حجز الباقة عبر رسالة مباشرة 📱</span>
        </button>

        <p className="text-[10px] text-stone-500 text-center mt-2">
          {isVipHall
            ? 'VIP حصري: حجز الصالة بالكامل للمناسبة'
            : 'يتم تأكيد التاريخ والوقت بعد إرسال الرسالة'}
        </p>
      </div>
    </motion.div>
  );
};
