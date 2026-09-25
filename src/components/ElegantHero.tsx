import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ElegantHeroProps {
  onScrollToPackages: () => void;
  onOpenBooking: () => void;
}

export const ElegantHero: React.FC<ElegantHeroProps> = ({
  onScrollToPackages,
  onOpenBooking,
}) => {
  const fullText = "Welcome to Magnum";
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setTypedChars(currentIndex);
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 85);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-20 px-4 sm:px-6 text-center">
      {/* Golden glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Royal Crown Emblem */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-5 inline-block"
        >
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl animate-pulse" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-stone-950/90 flex items-center justify-center border border-amber-400/40">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            </div>
          </div>
        </motion.div>

        {/* Small Elegant Eyebrow */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MAGNUM VIP CELEBRATION</span>
          </motion.div>
        </div>

        {/* Prominent Eye-Catching "Welcome to Magnum" (Permanent - Never disappears) */}
        <div className="min-h-[60px] sm:min-h-[80px] flex items-center justify-center mb-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 drop-shadow-[0_4px_24px_rgba(245,158,11,0.6)]">
            {fullText.slice(0, typedChars)}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-1.5 sm:w-2 h-8 sm:h-14 bg-amber-400 ml-1.5 align-middle rounded-full shadow-[0_0_10px_#f59e0b]"
            />
          </h1>
        </div>

        {/* Arabic Headline: عيد ميلادك ذكرى تستاهل الاحتفال مع MAGNUM */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl mx-auto mt-2"
        >
          عيد ميلادك{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
            ذكرى تستاهل الاحتفال مع MAGNUM
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-stone-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          أهلاً بكم في صالة MAGNUM.. نوفر لك حجز صالة الـ VIP بالكامل أو طاولات الـ VIP الفاخرة، اختار باقتك وخلي يومك مميز مع MAGNUM.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScrollToPackages}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-base shadow-xl shadow-amber-500/25 transition-shadow cursor-pointer flex items-center gap-2"
          >
            <Crown className="w-5 h-5 fill-stone-950" />
            <span>اكتشف الصالة والباقات الملكية 👑</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenBooking}
            className="px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-white font-bold text-base border border-stone-700 transition-colors cursor-pointer flex items-center gap-2 shadow-md"
          >
            <MessageCircle className="w-5 h-5 text-amber-400" />
            <span>تأكيد الحجز المباشر 📱</span>
          </motion.button>
        </motion.div>

        {/* Highlights Row with stagger animation */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-right">
          {[
            { emoji: '🏛️', title: 'صالة وطاولات VIP ملكية', desc: 'حجز قاعة الـ VIP بالكامل (1500 د) أو طاولات فخمة' },
            { emoji: '🎨', title: 'ديكور واختيار ألوان', desc: 'تنسيق مخصص حسب ذوقك وثيم الحفل الخاص' },
            { emoji: '⚡', title: 'تأكيد حجز سريع ومباشر', desc: 'تواصل مباشر عبر الواتساب لتثبيت التاريخ' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800/80 backdrop-blur-md"
            >
              <span className="text-lg block mb-1">{item.emoji}</span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-stone-400 mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
