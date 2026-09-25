import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  gravity: number;
  decay: number;
}

interface Spark {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
}

interface Balloon {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  swayAmp: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
}

interface Confetti {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface InteractiveSparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

const BALLOON_COLORS = [
  'rgba(245, 158, 11, 0.85)',   // Rich Gold
  'rgba(234, 179, 8, 0.85)',    // Bright Yellow
  'rgba(217, 119, 6, 0.85)',    // Deep Amber
  'rgba(168, 85, 247, 0.75)',   // Royal Purple
  'rgba(236, 72, 153, 0.75)',   // Rose Gold Pink
  'rgba(59, 130, 246, 0.75)',   // Sapphire Blue
  'rgba(16, 185, 129, 0.75)',   // Emerald Green
  'rgba(255, 255, 255, 0.8)',   // Pearl White
];

const FIREWORK_COLORS = [
  '#F59E0B', '#FBBF24', '#FDE047', '#EC4899', '#A855F7', '#60A5FA', '#34D399', '#F43F5E', '#FFFFFF'
];

const CONFETTI_COLORS = [
  '#F59E0B', '#FBBF24', '#FDE047', '#EC4899', '#A855F7', '#3B82F6', '#10B981', '#E11D48', '#FFFFFF'
];

export const BirthdayCelebrationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Interactive Sparkles from mouse/touch
    let interactiveSparkles: InteractiveSparkle[] = [];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Spawn celebratory cursor sparkles
      for (let i = 0; i < 3; i++) {
        interactiveSparkles.push({
          x: clientX + (Math.random() - 0.5) * 12,
          y: clientY + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          alpha: 1,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          size: 2 + Math.random() * 2.5,
          decay: 0.02 + Math.random() * 0.025,
        });
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 2. Balloons Array (Increased density & scale for richer atmosphere)
    const balloons: Balloon[] = [];
    const maxBalloons = Math.min(26, Math.floor(width / 50));

    for (let i = 0; i < maxBalloons; i++) {
      balloons.push({
        x: Math.random() * width,
        y: height + Math.random() * height * 1.2,
        speed: 0.7 + Math.random() * 1.1,
        size: 16 + Math.random() * 14,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        swayAmp: 18 + Math.random() * 26,
        swaySpeed: 0.014 + Math.random() * 0.022,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.4 + Math.random() * 0.45,
      });
    }

    // 3. Floating Confetti Pieces
    const confettis: Confetti[] = [];
    const maxConfetti = Math.min(45, Math.floor(width / 30));

    for (let i = 0; i < maxConfetti; i++) {
      confettis.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        speedY: 0.6 + Math.random() * 1.4,
        speedX: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }

    // 4. Fireworks Rockets & Particles (Frequent bursts)
    let fireworksRockets: Spark[] = [];
    let fireworkParticles: Particle[] = [];
    let lastFireworkTime = Date.now();

    const spawnFireworkRocket = () => {
      const startX = width * 0.1 + Math.random() * (width * 0.8);
      const targetY = height * 0.08 + Math.random() * (height * 0.4);
      fireworksRockets.push({
        x: startX,
        y: height + 20,
        targetY,
        vy: -5.2 - Math.random() * 2.8,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        exploded: false,
      });
    };

    const explodeRocket = (x: number, y: number, color: string) => {
      // Create double-ring colorful explosion
      const particleCount = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
        const speed = 1.8 + Math.random() * 4.2;
        fireworkParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.25 ? color : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          size: 2 + Math.random() * 2.5,
          gravity: 0.045,
          decay: 0.011 + Math.random() * 0.012,
        });
      }
    };

    // 5. Ambient Twinkling Stars
    const sparkles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 50; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.2 + Math.random() * 2.5,
        alpha: Math.random(),
        speed: 0.018 + Math.random() * 0.035,
      });
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // --- 1. Ambient Twinkling Stars ---
      for (let s of sparkles) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0.1) s.speed = -s.speed;
        ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.1, Math.min(0.85, s.alpha))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 2. Floating Confetti Pieces ---
      for (let c of confettis) {
        c.y += c.speedY;
        c.x += Math.sin(frameCount * 0.02 + c.rotation) * 0.6 + c.speedX;
        c.rotation += c.rotationSpeed;

        if (c.y > height + 20) {
          c.y = -20;
          c.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = c.opacity;
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
        ctx.restore();
      }

      // --- 3. Floating Balloons ---
      for (let b of balloons) {
        b.y -= b.speed;
        const sway = Math.sin(frameCount * b.swaySpeed + b.swayOffset) * b.swayAmp;
        const bx = b.x + sway;

        if (b.y < -b.size * 2) {
          b.y = height + 40 + Math.random() * 60;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = b.opacity;

        // Balloon Body (Oval)
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(bx, b.y, b.size * 0.82, b.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight shine on balloon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(bx - b.size * 0.28, b.y - b.size * 0.35, b.size * 0.22, b.size * 0.32, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Balloon bottom knot
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.moveTo(bx - 3.5, b.y + b.size);
        ctx.lineTo(bx + 3.5, b.y + b.size);
        ctx.lineTo(bx, b.y + b.size + 4.5);
        ctx.closePath();
        ctx.fill();

        // Balloon String (Curved line)
        ctx.strokeStyle = 'rgba(214, 211, 209, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bx, b.y + b.size + 4.5);
        ctx.quadraticCurveTo(bx - 5, b.y + b.size + 16, bx + 3, b.y + b.size + 28);
        ctx.stroke();

        ctx.restore();
      }

      // --- 4. Faster Firework Launch Timer (Every 1.6s) ---
      const now = Date.now();
      if (now - lastFireworkTime > 1650) {
        spawnFireworkRocket();
        lastFireworkTime = now;
      }

      // --- 5. Fireworks Rockets ---
      fireworksRockets = fireworksRockets.filter((r) => {
        r.y += r.vy;

        ctx.save();
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY) {
          explodeRocket(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      // --- 6. Firework Explosion Particles ---
      fireworkParticles = fireworkParticles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      // --- 7. Interactive Cursor / Touch Sparkles ---
      interactiveSparkles = interactiveSparkles.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
