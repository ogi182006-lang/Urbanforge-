// ============================================================
// UrbanForge — ParticleField (Canvas hero sparks)
// ============================================================
"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = [
  "rgba(0, 240, 255,",    // neon cyan
  "rgba(195, 0, 255,",    // neon purple
  "rgba(123, 0, 255,",    // neon mid
  "rgba(255, 0, 144,",    // neon pink
];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function spawnParticle() {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.2,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        color,
        life: 0,
        maxLife: Math.random() * 200 + 80,
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Spawn particles
      if (Math.random() < 0.4) spawnParticle();

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.005; // float up slightly

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        // Glow effect
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
