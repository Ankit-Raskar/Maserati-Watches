import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";

const GOLD = "#d4c896";
const GOLD_DEEP = "#a89a6a";
const GOLD_BRIGHT = "#f0e0a0";
const DARK = "#0c0c0b";
const CASE_DARK = "#1a1916";

/**
 * Stylised procedural watch — polished gold materials, Maserati trident bezel,
 * hour markers, sweep hand animation, smooth auto-rotation.
 */
function Watch({ spin = true }: { spin?: boolean }) {
  const group = useRef<Group>(null);
  const handSec = useRef<Group>(null);
  const handMin = useRef<Group>(null);
  const handHr = useRef<Group>(null);
  const bezelRef = useRef<Mesh>(null);

  // Shared premium materials
  const matGold = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 1.8,
      }),
    [],
  );
  const matGoldBright = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD_BRIGHT,
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 2,
        emissive: new THREE.Color(GOLD_BRIGHT),
        emissiveIntensity: 0.06,
      }),
    [],
  );
  const matGoldDeep = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD_DEEP,
        metalness: 0.95,
        roughness: 0.22,
        envMapIntensity: 1.4,
      }),
    [],
  );
  const matDial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: DARK,
        metalness: 0.65,
        roughness: 0.38,
        envMapIntensity: 0.6,
      }),
    [],
  );
  const matStrap = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CASE_DARK,
        metalness: 0.35,
        roughness: 0.75,
      }),
    [],
  );

  useFrame((_, dt) => {
    if (spin && group.current) group.current.rotation.y += dt * 0.32;
    // Realistic hand speeds: second > minute > hour
    if (handSec.current) handSec.current.rotation.z -= dt * 1.05;
    if (handMin.current) handMin.current.rotation.z -= dt * 0.017;
    if (handHr.current) handHr.current.rotation.z -= dt * 0.0014;
    // Subtle bezel shimmer
    if (bezelRef.current) {
      (bezelRef.current.material as THREE.MeshStandardMaterial).envMapIntensity =
        1.8 + Math.sin(performance.now() * 0.0012) * 0.4;
    }
  });

  const markerCount = 12;

  return (
    <group ref={group} rotation={[0.3, 0.3, 0]}>
      {/* Outer bezel ring */}
      <mesh ref={bezelRef} castShadow receiveShadow material={matGold}>
        <torusGeometry args={[1, 0.13, 64, 120]} />
      </mesh>

      {/* Inner bezel edge (depth) */}
      <mesh material={matGoldDeep}>
        <torusGeometry args={[0.93, 0.04, 32, 96]} />
      </mesh>

      {/* Case body */}
      <mesh position={[0, 0, -0.04]} castShadow material={matGoldDeep}>
        <cylinderGeometry args={[0.94, 0.9, 0.22, 96]} />
      </mesh>

      {/* Dial face */}
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]} material={matDial}>
        <cylinderGeometry args={[0.87, 0.87, 0.025, 96]} />
      </mesh>

      {/* Hour markers */}
      {Array.from({ length: markerCount }).map((_, i) => {
        const a = (i / markerCount) * Math.PI * 2;
        const isQuarter = i % 3 === 0;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.115]}
            rotation={[0, 0, a]}
            material={matGoldBright}
          >
            <boxGeometry
              args={isQuarter ? [0.05, 0.14, 0.025] : [0.03, 0.09, 0.02]}
            />
          </mesh>
        );
      })}

      {/* Centre jewel */}
      <mesh position={[0, 0, 0.13]} material={matGoldBright}>
        <cylinderGeometry args={[0.055, 0.055, 0.06, 32]} />
      </mesh>

      {/* Hour hand */}
      <group ref={handHr} position={[0, 0, 0.14]}>
        <mesh position={[0, 0.18, 0]} material={matGold}>
          <boxGeometry args={[0.06, 0.38, 0.022]} />
        </mesh>
      </group>

      {/* Minute hand */}
      <group ref={handMin} position={[0, 0, 0.16]}>
        <mesh position={[0, 0.26, 0]} material={matGoldBright}>
          <boxGeometry args={[0.04, 0.54, 0.02]} />
        </mesh>
      </group>

      {/* Second hand (slimmer, contrasting) */}
      <group ref={handSec} position={[0, 0, 0.18]}>
        <mesh position={[0, 0.28, 0]} material={matGoldBright}>
          <boxGeometry args={[0.018, 0.58, 0.016]} />
        </mesh>
        {/* Counter-weight */}
        <mesh position={[0, -0.14, 0]} material={matGoldBright}>
          <boxGeometry args={[0.022, 0.18, 0.016]} />
        </mesh>
      </group>

      {/* Crown */}
      <mesh position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={matGoldDeep}>
        <cylinderGeometry args={[0.085, 0.07, 0.16, 24]} />
      </mesh>

      {/* Pusher (chrono button, decorative) */}
      <mesh position={[1.06, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={matGoldDeep}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
      </mesh>

      {/* Strap — top */}
      <mesh position={[0, 1.2, -0.04]} material={matStrap} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.18]} />
      </mesh>
      {/* Strap — bottom */}
      <mesh position={[0, -1.2, -0.04]} material={matStrap} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.18]} />
      </mesh>
    </group>
  );
}

export function WatchScene({
  compact = false,
  interactive = false,
}: {
  compact?: boolean;
  interactive?: boolean;
}) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 36 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
    >
      {/* Lighting rig for luxury reflections */}
      <ambientLight intensity={0.3} color="#fff5e8" />
      <spotLight
        position={[4, 7, 5]}
        intensity={2.2}
        angle={0.36}
        penumbra={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#f0e4c0"
      />
      <spotLight
        position={[-5, -2, 4]}
        intensity={0.9}
        angle={0.55}
        penumbra={1}
        color="#a7a075"
      />
      <pointLight position={[0, 0, 3.2]} intensity={0.45} color="#fff5d6" />
      {/* Rim light from below for depth */}
      <pointLight position={[0, -3, 1]} intensity={0.25} color="#c8b870" />

      <Float
        speed={compact ? 1 : 1.5}
        rotationIntensity={compact ? 0.15 : 0.45}
        floatIntensity={compact ? 0.3 : 0.7}
      >
        <Watch spin={!compact && !interactive} />
      </Float>

      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.5}
        scale={7}
        blur={2.8}
        far={2.2}
        color="#000"
      />

      {/* Studio HDRI for reflections */}
      <Environment preset="studio" />

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.8}
          maxDistance={6.5}
          autoRotate
          autoRotateSpeed={1.5}
          rotateSpeed={0.75}
          dampingFactor={0.08}
          enableDamping
        />
      )}
    </Canvas>
  );
}
