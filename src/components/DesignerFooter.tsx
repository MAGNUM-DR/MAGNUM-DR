import React from 'react';

export const DesignerFooter: React.FC = () => {
  return (
    <footer className="w-full bg-black/95 text-white py-8 px-4 border-t border-amber-500/20">
      <div className="max-w-6xl mx-auto border border-amber-500/30 rounded-2xl p-6 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 dir-rtl">
          
          {/* قسم ماغنوم - اليمين */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <img 
              src="./images/photo_2026-09-25_03-54-35.jpg" 
              alt="شعار ماغنوم" 
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white">صالة MAGNUM</span>
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                  المكان الرسمي
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                أرقى حفلات أعياد الميلاد والجلسات الملوكيه، احتفالك يبدأ من MAGNUM.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a 
                  href="https://wa.me/218930279675" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 transition"
                >
                  واتساب الحجز
                </a>
                <span className="text-xs text-amber-400 font-mono bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">
                  0930279675
                </span>
              </div>
            </div>
          </div>

          {/* خط فاصل بين القسمين */}
          <div className="hidden md:block w-px h-16 bg-zinc-800"></div>

          {/* قسم المطور - اليسار */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <img 
              src="./images/my-logo.png" 
              alt="شعار المطور" 
              className="w-14 h-14 rounded-xl object-cover border border-amber-500/40 p-1 bg-zinc-800"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-semibold">تصميم وتطوير النظام:</span>
                <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full border border-zinc-700">
                  حقوق معتمدة
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">DR\ MOHAMED FARES</h4>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-amber-400 font-mono bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">
                  0943326462
                </span>
                <a 
                  href="https://wa.me/218943326462" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 transition"
                >
                  تواصل واتساب
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
