import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BalloonPopCelebrationProps {
  isActive: boolean;
  onPop?: () => void;
  onComplete: () => void;
}

// Crisp, lightweight audio synthesis without distortion
const playSmoothPopSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Clean, crisp pop click (super quick 0.05s)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore autoplay restriction
  }
};

const playSmoothInflateSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Ignore
  }
};

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  shape: 'circle' | 'square' | 'strip';
}

export const BalloonPopCelebration: React.FC<BalloonPopCelebrationProps> = ({
  isActive,
  onPop,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'inflating' | 'popping' | 'done'>('idle');
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (isActive && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setPhase('inflating');
      playSmoothInflateSound();

      // Smooth, natural inflation (0.55s), then sudden light pop
      const popTimer = setTimeout(() => {
        setPhase('popping');
        playSmoothPopSound();

        // Reveal packages instantly
        if (onPop) onPop();

        // Lightweight confetti burst: 32 silky particles (zero frame drop)
        const colors = [
          '#E11D48', '#FB7185', '#FBBF24', '#F59E0B', 
          '#FFFFFF', '#38BDF8', '#A855F7', '#34D399'
        ];
        const pieces: ConfettiPiece[] = Array.from({ length: 32 }).map((_, i) => {
          const angle = (i / 32) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
          const distance = 100 + Math.random() * 220;
          return {
            id: i,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            color: colors[i % colors.length],
            size: 6 + Math.random() * 8,
            rotation: Math.random() * 360 - 180,
            shape: (['circle', 'square', 'strip'] as const)[i % 3],
          };
        });
        setConfettiPieces(pieces);

        // Disappear smoothly after 200ms
        const finishTimer = setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 200);

        return () => clearTimeout(finishTimer);
      }, 550);

      return () => clearTimeout(popTimer);
    }

    if (!isActive) {
      setPhase('idle');
      hasTriggeredRef.current = false;
      setConfettiPieces([]);
    }
  }, [isActive, onPop, onComplete]);

  if (!isActive || phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden select-none bg-black/25"
      >
        {/* Soft, lightweight glow behind balloon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 rounded-full bg-rose-500/15 blur-2xl transition-opacity duration-300" />
        </div>

        {/* 1. SMOOTH, LIGHTWEIGHT INFLATION (Royal Ruby & Champagne Rose Color) */}
        {phase === 'inflating' && (
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.25, y: 50, opacity: 0 }}
              animate={{
                scale: [0.25, 1, 1.8, 2.4],
                y: [50, 10, -5, -10],
                opacity: [0, 1, 1, 1],
              }}
              transition={{
                duration: 0.55,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ willChange: 'transform' }}
              className="relative flex flex-col items-center"
            >
              {/* Subtle floating sparkle */}
              <div className="absolute -top-3 -right-3 pointer-events-none">
                <Sparkles className="w-5 h-5 text-amber-300 drop-shadow-sm animate-pulse" />
              </div>

              {/* NEW COLOR: Royal Metallic Ruby & Champagne Rose (ياقوتي ملكي مع لمعان ذهبي ناعم) */}
              <div className="relative w-40 h-48 sm:w-44 sm:h-52 rounded-[50%_50%_50%_50%_/_44%_44%_56%_56%] bg-gradient-to-tr from-rose-700 via-rose-500 to-amber-200 shadow-[0_12px_30px_rgba(225,29,72,0.4),inset_-10px_-10px_20px_rgba(159,18,57,0.5),inset_12px_12px_22px_rgba(255,255,255,0.75)] flex items-center justify-center">
                
                {/* Specular Light Curved Sheen */}
                <div className="absolute top-4 left-6 w-9 h-14 rounded-[50%] bg-white/70 rotate-[-35deg]" />
                <div className="absolute top-6 left-10 w-2.5 h-4 rounded-[50%] bg-white/90 rotate-[-35deg]" />

                {/* Crown Monogram */}
                <div className="text-center font-black text-rose-950 text-2xl drop-shadow-sm select-none">
                  👑
                  <div className="text-[10px] tracking-widest font-serif font-black text-amber-100 mt-0.5 drop-shadow">
                    MAGNUM
                  </div>
                </div>
              </div>

              {/* Balloon Knot */}
              <div className="w-3.5 h-2.5 bg-rose-800 rounded-b-md shadow-sm -mt-0.5" />

              {/* Smooth Gold Ribbon */}
              <svg
                width="14"
                height="40"
                viewBox="0 0 14 40"
                className="stroke-amber-300 fill-none -mt-0.5"
              >
                <path
                  d="M7,0 Q12,10 4,20 T7,40"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>
        )}

        {/* 2. LIGHTWEIGHT POP (Zero Lag / بدون أي تهنيج) */}
        {phase === 'popping' && (
          <div className="relative flex items-center justify-center">
            {/* Quick clean light burst */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-24 h-24 rounded-full bg-white/60 blur-xs"
            />

            {/* Smooth 32-particle Confetti Splash */}
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: piece.x,
                  y: piece.y + 15,
                  scale: [1, 0.8, 0],
                  opacity: [1, 0.8, 0],
                  rotate: piece.rotation,
                }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  width: piece.size,
                  height: piece.shape === 'strip' ? piece.size * 2 : piece.size,
                  backgroundColor: piece.color,
                  borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'strip' ? '2px' : '1px',
                }}
                className="absolute z-20 pointer-events-none"
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
