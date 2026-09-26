import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Crown,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { PACKAGES } from '../data/packages';

const DEFAULT_COLOR_OPTIONS = [
  'ذهبي ملكي (Royal Gold)',
  'وردي وأبيض (Pink & White)',
  'أزرق ملكي (Royal Blue)',
  'أسود وذهبي (Black & Gold)',
  'فضي وأبيض (Silver & White)',
  'اختيار لون على ذوقك',
];

interface BookingModalProps {
  isOpen: boolean;
  initialPackageId: string;
  initialColorName?: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialPackageId,
  initialColorName,
  onClose,
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    initialPackageId || 'package-vip-all'
  );
  const [celebrantName, setCelebrantName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('08:00 مساءً');
  const [selectedColor, setSelectedColor] = useState(initialColorName || DEFAULT_COLOR_OPTIONS[0]);
  const [customColorDetail, setCustomColorDetail] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialPackageId) {
      setSelectedPkgId(initialPackageId);
    }
    if (initialColorName) {
      if (initialColorName.includes('اختيار لون على ذوقك')) {
        setSelectedColor('اختيار لون على ذوقك');
        const match = initialColorName.match(/\((.*?)\)/);
        setCustomColorDetail(match ? match[1] : '');
      } else {
        setSelectedColor(initialColorName);
        setCustomColorDetail('');
      }
    }
  }, [isOpen, initialPackageId, initialColorName]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPkg = PACKAGES.find((p) => p.id === selectedPkgId) || PACKAGES[0];
  const totalPrice = currentPkg.price;
  const availableColors = (currentPkg as any).colorOptions || DEFAULT_COLOR_OPTIONS;

  const buildMessage = () => {
    let msg = `*طلب تأكيد حجز عيد ميلاد في MAGNUM* 🎉✨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👑 *الطلب:* ${currentPkg.badge} - ${currentPkg.title}\n`;
    msg += `💰 *السعر:* ${totalPrice} دينار\n`;
    if (currentPkg.guestCount) {
      msg += `👥 *العدد:* ${typeof currentPkg.guestCount === 'number' ? `حتى ${currentPkg.guestCount} أشخاص` : currentPkg.guestCount}\n`;
    } else {
      msg += `✨ *المحتوى:* طاولة الـ VIP تشمل تجهيز الطاولة فقط\n`;
    }

    if (currentPkg.hasColorChoice) {
      const finalColor =
        selectedColor.includes('اختيار لون على ذوقك') && customColorDetail.trim()
          ? `اختيار لون على ذوقك (${customColorDetail.trim()})`
          : selectedColor;
      msg += `🎨 *لون وثيم الديكور المفضل:* ${finalColor}\n`;
    }

    if (celebrantName.trim()) {
      msg += `🎂 *اسم صاحب العيد ميلاد:* ${celebrantName.trim()}\n`;
    }
    if (bookingDate) {
      msg += `📅 *تاريخ الحفل المطلوب:* ${bookingDate}\n`;
    }
    if (bookingTime) {
      msg += `⏰ *التوقيت المفضل:* ${bookingTime}\n`;
    }
    if (contactPhone.trim()) {
      msg += `📱 *رقم هاتف العميل:* ${contactPhone.trim()}\n`;
    }
    if (notes.trim()) {
      msg += `📝 *ملاحظات إضافية:* ${notes.trim()}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━\n`;
    msg += `مرحباً، أود تأكيد حجز هذه المناسبة في MAGNUM. يرجى إفادتي بالتفاصيل وتأكيد التوفر. شكراً لكم!`;
    return msg;
  };

  const handleSendDirectMessage = () => {
    const text = encodeURIComponent(buildMessage());
    const phone = '218930279675';
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl my-6 sm:my-8 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/95 hover:bg-stone-700 text-amber-300 hover:text-white border-2 border-amber-500/70 shadow-lg shadow-black/60 transition cursor-pointer group active:scale-95"
        >
          <X className="w-4 h-4 text-amber-400 group-hover:rotate-90 group-hover:text-red-400 transition-all duration-200" />
          <span className="text-xs font-bold">إغلاق ✕</span>
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-stone-800 pl-24 sm:pl-28">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>رسالة الحجز المباشر في MAGNUM</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
            تأكيد حجز مناسبتك في MAGNUM 🎂
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            سيتم تحويلك مباشرة للواتساب إلى الرقم <strong className="text-amber-400 font-mono">0930279675</strong> بكافة تفاصيل الحجز جاهزة للإرسال.
          </p>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          {/* Select Package */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5">
              اختر الخيار المطلوب:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPkgId(pkg.id);
                  }}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    selectedPkgId === pkg.id
                      ? 'border-amber-500 bg-amber-500/20 text-white font-bold ring-1 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="block text-base sm:text-lg">{pkg.badgeEmoji}</span>
                  <span className="block text-[10px] sm:text-[11px] font-bold mt-0.5 truncate">{pkg.badge}</span>
                  <span className="block text-xs text-amber-400 font-extrabold">{pkg.price} د.ل</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {currentPkg.hasColorChoice && (
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                لون وثيم الديكور المفضل:
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {availableColors.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {selectedColor.includes('اختيار لون على ذوقك') && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">
                    اكتب اللون أو التنسيق المطلوب على ذوقك:
                  </label>
                  <input
                    type="text"
                    value={customColorDetail}
                    onChange={(e) => setCustomColorDetail(e.target.value)}
                    placeholder="مثال: وردي وأبيض، بنفسجي، سماوي وذهبي..."
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-amber-500/40 text-amber-200 placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Celebrant Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                اسم صاحب العيد ميلاد:
              </label>
              <input
                type="text"
                placeholder="مثال: يوسف، سارة..."
                value={celebrantName}
                onChange={(e) => setCelebrantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                رقم للتواصل وتأكيد الحجز:
              </label>
              <input
                type="tel"
                placeholder="091xxxxxxx"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                تاريخ الحفل المطلوب: *
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                الوقت المفضل:
              </label>
              <input
                type="text"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                placeholder="مثلاً: 8:00 مساءً"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="block text-xs text-stone-400">الباقة المختارة:</span>
              <span className="text-sm font-bold text-white">{currentPkg.title}</span>
              {currentPkg.guestCount && (
                <span className="block text-[11px] text-amber-300 font-semibold mt-0.5">
                  👥 السعة: {typeof currentPkg.guestCount === 'number' ? `${currentPkg.guestCount} أشخاص` : currentPkg.guestCount}
                </span>
              )}
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-amber-400">{totalPrice}</span>
              <span className="text-xs font-bold text-stone-400 mr-1">دينار</span>
            </div>
          </div>

          {currentPkg.id === 'package-3' && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-snug">
              ⚠️ <strong>ملحوظة باقة الـ 250 دينار:</strong> مخصصة لعدد <strong>4 أشخاص</strong> وتشمل تجهيز الطاولة فقط بدون ديكور.
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleSendDirectMessage}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال رسالة مباشرة للواتساب (0930279675) 💬</span>
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ نص الحجز بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-400" />
                  <span>نسخ نص الحجز يدوياً</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-800 hover:border-stone-700 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-stone-400" />
              <span>إلغاء والعودة لصفحة الباقات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
