// ============================================================
// UrbanForge — SpinWheel (Gamification discount wheel)
// ============================================================
"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import type { SpinResult } from "@/types";

const SEGMENTS: SpinResult[] = [
  { discount: 5, label: "5% OFF", color: "#00f0ff" },
  { discount: 10, label: "10% OFF", color: "#c300ff" },
  { discount: 0, label: "Try Again", color: "#333355" },
  { discount: 15, label: "15% OFF", color: "#7b00ff" },
  { discount: 5, label: "5% OFF", color: "#00f0ff" },
  { discount: 20, label: "20% OFF", color: "#ff0090" },
  { discount: 0, label: "Better Luck", color: "#222244" },
  { discount: 10, label: "10% OFF", color: "#c300ff" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const CENTER = 160;
const RADIUS = 145;

interface SpinWheelProps {
  onResult: (result: SpinResult) => void;
}

export default function SpinWheel({ onResult }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const controls = useAnimation();
  const currentRotation = useRef(0);

  const spin = useCallback(async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    // Pick winning segment (weighted: more likely to win something)
    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segment = SEGMENTS[winningIndex];

    // Calculate target rotation
    const segmentCenter = winningIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = extraSpins + (360 - segmentCenter) + 90;

    const totalRotation = currentRotation.current + targetAngle;
    currentRotation.current = totalRotation % 360;

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4 + Math.random() * 2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    });

    setIsSpinning(false);
    setHasSpun(true);
    setLastResult(segment);
    onResult(segment);
  }, [isSpinning, hasSpun, controls, onResult]);

  // SVG Wheel paths
  function polarToCartesian(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: CENTER + r * Math.cos(rad),
      y: CENTER + r * Math.sin(rad),
    };
  }

  function segmentPath(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle, RADIUS);
    const end = polarToCartesian(endAngle, RADIUS);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-8px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, #00f0ff, #c300ff, #7b00ff, #ff0090, #00f0ff)",
            filter: "blur(12px)",
            opacity: isSpinning ? 0.8 : 0.4,
            transition: "opacity 0.3s",
          }}
        />

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "20px solid #00f0ff",
              filter: "drop-shadow(0 0 8px #00f0ff)",
            }}
          />
        </div>

        {/* SVG Wheel */}
        <motion.div
          animate={controls}
          style={{ width: 320, height: 320 }}
          className="relative z-10 cursor-pointer"
          onClick={spin}
        >
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            aria-label="Spin the discount wheel"
          >
            {/* Segments */}
            {SEGMENTS.map((segment, i) => {
              const startAngle = i * SEGMENT_ANGLE;
              const endAngle = (i + 1) * SEGMENT_ANGLE;
              const midAngle = startAngle + SEGMENT_ANGLE / 2;
              const textPos = polarToCartesian(midAngle, RADIUS * 0.65);

              return (
                <g key={i}>
                  {/* Segment fill */}
                  <path
                    d={segmentPath(startAngle, endAngle)}
                    fill={segment.color}
                    fillOpacity={segment.discount === 0 ? 1 : 0.85}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth={2}
                  />

                  {/* Segment glow overlay */}
                  {segment.discount > 0 && (
                    <path
                      d={segmentPath(startAngle, endAngle)}
                      fill="url(#segGlow)"
                      fillOpacity={0.2}
                    />
                  )}

                  {/* Label */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="Manrope, sans-serif"
                    transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}

            {/* Center circle */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={28}
              fill="#050508"
              stroke="rgba(0,240,255,0.5)"
              strokeWidth={2}
            />
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#00f0ff"
              fontSize="20"
            >
              ⚡
            </text>

            <defs>
              <radialGradient id="segGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="white" stopOpacity={0.3} />
                <stop offset="100%" stopColor="white" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Spin button */}
      {!hasSpun ? (
        <motion.button
          onClick={spin}
          disabled={isSpinning}
          whileTap={{ scale: 0.95 }}
          className={`
            px-10 py-4 rounded-2xl font-black text-base transition-all duration-300
            min-h-[var(--tap-min)] min-w-[200px]
            ${isSpinning
              ? "bg-white/5 text-[var(--text-muted)] cursor-not-allowed"
              : "bg-gradient-to-r from-[#00f0ff] to-[#c300ff] text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            }
          `}
        >
          {isSpinning ? "Spinning…" : "🎰 Spin for Discount!"}
        </motion.button>
      ) : (
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center glass-card p-5 rounded-2xl min-w-[240px]"
              style={{ borderColor: lastResult.color + "50" }}
            >
              {lastResult.discount > 0 ? (
                <>
                  <p className="text-4xl font-black mb-1" style={{ color: lastResult.color }}>
                    {lastResult.label}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Applied to your order! 🎉
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-1">😔</p>
                  <p className="text-lg font-bold text-[var(--text-secondary)]">
                    No luck this time
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Order anyway — quality never disappoints!
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <p className="text-xs text-[var(--text-muted)] text-center">
        One spin per order. Discount applied via WhatsApp message.
      </p>
    </div>
  );
}
