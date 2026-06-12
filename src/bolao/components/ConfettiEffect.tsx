import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = ['#FFD700', '#FFF176', '#10B981', '#3B82F6', '#F59E0B', '#EC4899'];

export function ConfettiEffect({ active, onDone }: { active: boolean; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 1) * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: 60 + Math.random() * 40,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        p.life++;
        p.x += p.vx;
        p.vy += 0.25;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;
        if (alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
          ctx.restore();
        }
      }

      if (alive) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
