"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  Component,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Brand colors ───────────────────────────────────────────
const COLORS = {
  teal: "#00D9E6",
  tealGreen: "#4DBFAC",
  green: "#5BBD8A",
  sky: "#4BA8C9",
  indigo: "#7B84D9",
  violet: "#A07BD9",
  apricot: "#E09860",
  coral: "#E07A7A",
} as const;

const PLANET_DATA = [
  { ring: 0, color: COLORS.teal, size: 0.12, speed: 0.6, offset: 0, task: "Team meeting" },
  { ring: 0, color: COLORS.coral, size: 0.1, speed: 0.75, offset: 2.1, task: "Doctor appt" },
  { ring: 0, color: COLORS.apricot, size: 0.09, speed: 0.5, offset: 4.2, task: "Pay rent" },
  { ring: 1, color: COLORS.green, size: 0.14, speed: 0.35, offset: 1.0, task: "Call mum" },
  { ring: 1, color: COLORS.sky, size: 0.11, speed: 0.3, offset: 3.5, task: "Submit report" },
  { ring: 1, color: COLORS.indigo, size: 0.13, speed: 0.25, offset: 5.5, task: "Gym" },
  { ring: 2, color: COLORS.violet, size: 0.16, speed: 0.15, offset: 0.8, task: "Birthday dinner" },
  { ring: 2, color: COLORS.tealGreen, size: 0.12, speed: 0.12, offset: 3.8, task: "Flight" },
] as const;

const RING_RADII = [1.8, 3.2, 4.8] as const;
const MAX_TRAIL = 50;

// ── Starfield ──────────────────────────────────────────────
function Starfield({ count = 1200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [geo, mat] = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.025,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return [g, m] as const;
  }, [count]);

  const obj = useMemo(() => new THREE.Points(geo, mat), [geo, mat]);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.006;
      ref.current.rotation.x += dt * 0.003;
    }
  });

  return <primitive ref={ref} object={obj} />;
}

// ── Glowing NOW sphere ─────────────────────────────────────
function NowSphere() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.8) * 0.06;
    if (coreRef.current) coreRef.current.scale.setScalar(pulse);
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0}
        />
      </mesh>
      <pointLight color="#ffffff" intensity={0.8} distance={5} decay={2} />
      <pointLight color={COLORS.teal} intensity={0.4} distance={3} decay={2} />
    </group>
  );
}

// ── Orbital ring ───────────────────────────────────────────
function OrbitalRing({ radius }: { radius: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(clock.getElapsedTime() * 0.5 + radius) * 0.02;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.006, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

// ── Planet with trail + per-planet PointLight ──────────────
function Planet({
  data,
  isMobile,
}: {
  data: (typeof PLANET_DATA)[number];
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const trailLine = useRef<THREE.Line | null>(null);
  const trailIdx = useRef(0);
  const trailCount = useRef(0);
  const [hovered, setHovered] = useState(false);
  const driftRef = useRef(0);
  const radius = RING_RADII[data.ring];

  // Create trail geometry once
  useEffect(() => {
    const pos = new Float32Array(MAX_TRAIL * 3);
    const geom = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute("position", attr);
    geom.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.35,
    });
    const line = new THREE.Line(geom, mat);
    trailLine.current = line;
    groupRef.current?.parent?.add(line);
    return () => {
      geom.dispose();
      mat.dispose();
      groupRef.current?.parent?.remove(line);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.color]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * data.speed + data.offset;

    driftRef.current += 0.00002;
    const r = radius - driftRef.current;

    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = Math.sin(t * 0.3 + data.offset) * 0.08;

    // Move whole group (planet + glow + light move together)
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    if (meshRef.current) {
      const targetScale = hovered ? 1.6 : 1;
      const curr = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(curr + (targetScale - curr) * 0.08);
    }

    if (glowRef.current) {
      const s = hovered ? 3.5 : 2.2;
      const curr = glowRef.current.scale.x;
      glowRef.current.scale.setScalar(curr + (s - curr) * 0.08);
    }

    if (lightRef.current) {
      lightRef.current.intensity = hovered ? 0.8 : 0.4;
    }

    // Trail: write to scene-space positions (trail is added to parent, not group)
    const line = trailLine.current;
    if (line) {
      const attr = line.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const idx = trailIdx.current % MAX_TRAIL;
      arr[idx * 3] = x;
      arr[idx * 3 + 1] = y;
      arr[idx * 3 + 2] = z;
      trailIdx.current++;
      trailCount.current = Math.min(trailCount.current + 1, MAX_TRAIL);
      attr.needsUpdate = true;
      line.geometry.setDrawRange(0, trailCount.current);
    }

    if (driftRef.current > radius * 0.12) driftRef.current = 0;
  });

  const onEnter = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);
  const onLeave = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  return (
    <group ref={groupRef}>
      {/* Per-planet point light */}
      <pointLight
        ref={lightRef}
        color={data.color}
        intensity={0.4}
        distance={3}
        decay={2}
      />
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[data.size, 16, 16]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={isMobile ? () => setHovered((h) => !h) : undefined}
      >
        <sphereGeometry args={[data.size, 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 1.8 : 0.8}
          toneMapped={false}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// ── Camera controller with scroll zoom ────────────────────
interface CameraControllerProps {
  zoomProgress: React.RefObject<{ value: number }>;
}

function CameraControllerV2({ zoomProgress }: CameraControllerProps) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.4 - target.current.x) * 0.03;
    target.current.y += (mouse.current.y * 0.25 - target.current.y) * 0.03;

    // ScrollTrigger zoom: camera Z from 9 → 5 as zoomProgress goes 0 → 1
    const zoom = zoomProgress.current?.value ?? 0;
    const targetZ = 9 - zoom * 4;

    camera.position.x = target.current.x;
    camera.position.y = target.current.y + 2;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Scene ─────────────────────────────────────────────────
function SceneV2({
  zoomProgress,
}: {
  zoomProgress: React.RefObject<{ value: number }>;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[5, 5, 5]} intensity={0.15} color="#ffffff" />
      <CameraControllerV2 zoomProgress={zoomProgress} />
      <Starfield count={isMobile ? 400 : 1200} />
      <NowSphere />
      {RING_RADII.map((r, i) => (
        <OrbitalRing key={i} radius={r} />
      ))}
      {PLANET_DATA.map((p, i) => (
        <Planet key={i} data={p} isMobile={isMobile} />
      ))}
      {/* Bloom postprocessing — only emissive surfaces bloom */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          intensity={0.55}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ── CSS fallback ───────────────────────────────────────────
function CSSOrbitFallback() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-24 h-24 rounded-full bg-white/60 blur-2xl"
        style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-[var(--color-teal)]"
        style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
      {[180, 310, 460].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-white/[0.06]"
          style={{
            width: size,
            height: size,
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

// ── Error boundary ─────────────────────────────────────────
class CanvasErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ── Export ────────────────────────────────────────────────
interface OrbitSceneV2Props {
  zoomProgress: React.RefObject<{ value: number }>;
}

export default function OrbitSceneV2({ zoomProgress }: OrbitSceneV2Props) {
  return (
    <div className="absolute inset-0 z-0">
      <CanvasErrorBoundary fallback={<CSSOrbitFallback />}>
        <Canvas
          camera={{ position: [0, 2, 9], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
          }}
        >
          <SceneV2 zoomProgress={zoomProgress} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
