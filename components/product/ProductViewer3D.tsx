// ============================================================
// UrbanForge — ProductViewer3D (@react-three/fiber)
// Heavy component — always lazy loaded
// ============================================================
"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, PresentationControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

// ── Floating placeholder product model ─────────────────────
function ProductBox({ color = "#00f0ff" }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Holographic edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </lineSegments>
    </Float>
  );
}

// ── Scene with lighting ─────────────────────────────────────
function Scene({ productColor }: { productColor?: string }) {
  return (
    <>
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <ProductBox color={productColor} />
      </PresentationControls>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight
        position={[5, 5, 5]}
        intensity={1}
        color="#00f0ff"
      />
      <pointLight
        position={[-5, -3, -3]}
        intensity={0.5}
        color="#c300ff"
      />
      <pointLight
        position={[0, -5, 0]}
        intensity={0.3}
        color="#7b00ff"
      />

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        autoRotate={false}
        makeDefault
      />
    </>
  );
}

// ── Fallback for no 3D model ────────────────────────────────
function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-2xl animate-float"
        style={{
          background: "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(195,0,255,0.2))",
          border: "1px solid rgba(0,240,255,0.3)",
          boxShadow: "0 0 40px rgba(0,240,255,0.2)",
        }}
      />
    </div>
  );
}

// ── Loading overlay ─────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div
        className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: "#00f0ff",
          borderRightColor: "#c300ff",
        }}
      />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
interface ProductViewer3DProps {
  modelUrl?: string;
  productColor?: string;
  productName?: string;
}

export default function ProductViewer3D({
  modelUrl: _modelUrl,
  productColor = "#00f0ff",
  productName = "Product",
}: ProductViewer3DProps) {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] glass-card rounded-2xl overflow-hidden">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => setIs3DMode(!is3DMode)}
          className="glass flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[#00f0ff] transition-all"
          aria-label="Toggle 3D view"
        >
          {is3DMode ? "3D" : "IMG"}
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* 3D Hint */}
      <AnimatePresence>
        {is3DMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20"
          >
            <span className="glass px-3 py-1.5 rounded-full text-xs text-[var(--text-muted)] whitespace-nowrap">
              👆 Drag to spin · Scroll to zoom
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neon glow ring */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: "linear-gradient(135deg, rgba(0,240,255,0.03), rgba(195,0,255,0.03))",
          border: "1px solid rgba(0,240,255,0.15)",
        }}
      />

      {is3DMode ? (
        <>
          {isLoading && <LoadingSpinner />}
          <Canvas
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            style={{ background: "transparent" }}
            onCreated={() => setIsLoading(false)}
            aria-label={`3D view of ${productName}`}
          >
            <Suspense fallback={null}>
              <Scene productColor={productColor} />
            </Suspense>
          </Canvas>
        </>
      ) : (
        <Fallback />
      )}

      {/* Reflective floor glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${productColor}30, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
