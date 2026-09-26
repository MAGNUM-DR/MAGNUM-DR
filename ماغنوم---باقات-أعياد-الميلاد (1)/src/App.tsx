import React, { useState, useEffect } from 'react';
import { BrandingHeader } from './components/BrandingHeader';
import { ElegantHero } from './components/ElegantHero';
import { PackageCard } from './components/PackageCard';
import { DesignerFooter } from './components/DesignerFooter';
import { BookingModal } from './components/BookingModal';
import { PackageGalleryModal } from './components/PackageGalleryModal';
import { BirthdayCelebrationCanvas } from './components/BirthdayCelebrationCanvas';
import { BalloonPopCelebration } from './components/BalloonPopCelebration';
import { PACKAGES } from './data/packages';
import { BirthdayPackage } from './types';
import { MessageCircle, CheckCircle2, Crown, Sparkles, Heart, Sparkle } from 'lucide-react';
import { motion } from 'motion/react';
import { safeGetLocalStorage } from './utils/imageStorage';
import { EMBEDDED_PACKAGE_IMAGES } from './data/embeddedMedia';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<
    'package-vip-hall' | 'package-1' | 'package-2' | 'package-3'
  >('package-vip-hall');
  const [selectedColorName, setSelectedColorName] = useState<string | undefined>(undefined);

  // Gallery Modal state for viewing real photos
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryPackage, setGalleryPackage] = useState<BirthdayPackage | null>(null);

  // Stored photos per package with integrated Base64 celebration photos as default
  const [packageImages] = useState<Record<string, string[]>>(() => {
    try {
      const saved = safeGetLocalStorage('magnum_custom_package_images');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...EMBEDDED_PACKAGE_IMAGES,
        ...parsed,
      };
    } catch {
      return EMBEDDED_PACKAGE_IMAGES;
    }
  });

  const handleOpenGallery = (pkg: BirthdayPackage) => {
    setGalleryPackage(pkg);
    setGalleryModalOpen(true);
  };

  const handleOpenBooking = (
    pkgId: 'package-vip-hall' | 'package-1' | 'package-2' | 'package-3' = 'package-vip-hall',
    colorName?: string
  ) => {
    setSelectedPackageId(pkgId);
    setSelectedColorName(colorName);
    setBookingModalOpen(true);
  };

  const handleCardBookNow = (pkg: BirthdayPackage, selectedColor?: string) => {
    handleOpenBooking(pkg.id, selectedColor);
  };

  // Balloon celebration is inactive initially. It only triggers when the user clicks "اكتشف الصالة"
  const [balloonCelebrationActive, setBalloonCelebrationActive] = useState(false);
  const [packagesHighlighted, setPackagesHighlighted] = useState(false);

  const handleDiscoverPackagesClick = () => {
    // Triggers fast balloon surprise and pop before revealing packages
    setBalloonCelebrationActive(true);
  };

  const handleBalloonCelebrationComplete = () => {
    setBalloonCelebrationActive(false);
    scrollToPackages();
  };

  const handleBalloonPop = () => {
    scrollToPackages();
  };

  const scrollToPackages = () => {
    const el = document.getElementById('packages-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setPackagesHighlighted(true);
      setTimeout(() => setPackagesHighlighted(false), 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 relative overflow-x-hidden"
    >
      {/* Interactive Balloon Pop Celebration when user clicks "اكتشف الصالة" */}
      <BalloonPopCelebration
        isActive={balloonCelebrationActive}
        onComplete={handleBalloonCelebrationComplete}
        onPop={handleBalloonPop}
      />

      {/* Animated Birthday Celebration Canvas (Balloons, Fireworks, Confetti, Sparkles) */}
      <BirthdayCelebrationCanvas />

      {/* Header focused purely on Magnum */}
      <BrandingHeader
        onOpenBooking={() => handleOpenBooking('package-vip-hall')}
        onScrollToPackages={handleDiscoverPackagesClick}
      />

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Elegant Clean Hero */}
        <ElegantHero
          onScrollToPackages={handleDiscoverPackagesClick}
          onOpenBooking={() => handleOpenBooking('package-vip-hall')}
        />

        {/* 2. Official VIP Hall & Packages Section */}
        <section
          id="packages-section"
          className={`py-12 px-4 sm:px-6 max-w-7xl mx-auto transition-all duration-700 rounded-3xl ${
            packagesHighlighted ? 'ring-2 ring-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-amber-500/[0.03]' : ''
          }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 backdrop-blur-md">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>صالة وباقات الـ VIP الحصرية للاحتفال</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              خيارات وباقات أعياد الميلاد في MAGNUM 🎂
            </h2>
            <p className="mt-2 text-stone-300 text-xs sm:text-base leading-relaxed">
              اختر بين <strong className="text-amber-400">حجز صالة الـ VIP بالكامل (1500 دينار)</strong> أو <strong className="text-amber-400">طاولات الـ VIP</strong>، واضغط على <strong className="text-amber-400">"صور من تجهيزاتنا"</strong> لاستعراض الصور الحقيقية للتجهيزات.
            </p>
          </div>

          {/* 4 Packages Grid: صالة الـ VIP (1500) + باقة 1 (750) + باقة 2 (500) + باقة 3 (250) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {PACKAGES.map((pkg, index) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                index={index}
                customImages={packageImages[pkg.id] || EMBEDDED_PACKAGE_IMAGES[pkg.id] || []}
                onBookNow={handleCardBookNow}
                onOpenGallery={handleOpenGallery}
              />
            ))}
          </div>

          {/* Special Conclusion Showcase Banner: احتفالك يبدأ من MAGNUM */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/20 border-2 border-amber-400/60 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl shadow-amber-500/10"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black mb-4">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>MAGNUM للمناسبات الراقية</span>
              </span>

              {/* Exact Requested Grand Ending Sentence */}
              <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                احتفالك يبدأ من{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                  MAGNUM
                </span>{' '}
                ✨
              </h3>

              <p className="text-stone-200 text-sm sm:text-lg mt-3 max-w-xl mx-auto">
                للتواصل معنا يرجى إرسال رسالة مباشرة لتأكيد الحجز وتحديد التاريخ المطلوب.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => handleOpenBooking('package-vip-hall')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-base shadow-xl shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer flex items-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5 fill-stone-950" />
                  <span>تأكيد الحجز عبر رسالة مباشرة 📱</span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer with Designer Accreditation (DR\ MOHAMED FARES) */}
      <DesignerFooter
        onOpenBooking={() => handleOpenBooking('package-vip-hall')}
        onScrollToTop={scrollToTop}
      />

      {/* Sticky Mobile Direct Booking Bar */}
      <div className="sm:hidden sticky bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-3 flex items-center justify-between gap-2 shadow-2xl">
        <div className="text-[11px] text-stone-400 font-bold">
          تصميم: <span className="text-amber-400">DR\ MOHAMED FARES</span>
        </div>

        <button
          onClick={() => handleOpenBooking('package-vip-hall')}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>احجز صالة أو باقة VIP واتساب</span>
        </button>
      </div>

      {/* Real Photos Viewer Modal */}
      <PackageGalleryModal
        isOpen={galleryModalOpen}
        pkg={galleryPackage}
        customImages={galleryPackage ? (packageImages[galleryPackage.id] || EMBEDDED_PACKAGE_IMAGES[galleryPackage.id] || []) : []}
        onClose={() => setGalleryModalOpen(false)}
      />

      {/* Booking Direct Message Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        initialPackageId={selectedPackageId}
        initialColorName={selectedColorName}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
