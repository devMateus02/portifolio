import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const DAMP = 0.18;
const PLANE = 6;
const GAP = 1;

/* detecção de mobile local (sem arquivo externo) */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return isMobile;
}

function TilesMesh({ texture, pointer, aspect, q }) {
  const groupRef = useRef();
  const { viewport } = useThree();

  const cols = q.grid;
  const rows = Math.max(1, Math.round(q.grid / aspect));
  const planeW = PLANE;
  const planeH = PLANE / aspect;
  const cellW = planeW / cols;
  const cellH = planeH / rows;

  const tiles = useMemo(() => {
    const arr = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = (x - cols / 2 + 0.5) * cellW;
        const py = (y - rows / 2 + 0.5) * cellH;

        const g = new THREE.BoxGeometry(cellW * GAP, cellH * GAP, cellW * 0.05);
        const u0 = x / cols, u1 = (x + 1) / cols;
        const v0 = y / rows, v1 = (y + 1) / rows;
        const uv = g.attributes.uv;
        uv.setXY(16, u0, v1); uv.setXY(17, u1, v1);
        uv.setXY(18, u0, v0); uv.setXY(19, u1, v0);
        const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2;
        for (let f = 0; f < 16; f++) uv.setXY(f, uc, vc);
        for (let f = 20; f < 24; f++) uv.setXY(f, uc, vc);
        uv.needsUpdate = true;

        arr.push({ geometry: g, baseX: px, baseY: py, z: 0, key: `${x}-${y}` });
      }
    }
    return arr;
  }, [cols, rows, cellW, cellH]);

  // material mais barato no mobile (Basic = sem cálculo de luz)
  const mat = useMemo(() => {
    return q.lights
      ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.75, metalness: 0 })
      : new THREE.MeshBasicMaterial({ map: texture });
  }, [texture, q.lights]);

  // libera memória ao desmontar
  useEffect(() => {
    return () => {
      tiles.forEach((t) => t.geometry.dispose());
      mat.dispose();
    };
  }, [tiles, mat]);

  useFrame(({ clock }) => {
    const grp = groupRef.current;
    if (!grp) return;
    const t = clock.getElapsedTime();
    const mx = pointer.current.active ? (pointer.current.x * viewport.width) / 2 : 99999;
    const my = pointer.current.active ? (pointer.current.y * viewport.height) / 2 : 99999;

    grp.children.forEach((mesh, i) => {
      const tile = tiles[i];
      const idle =
        Math.sin(tile.baseX * 1.2 + t * 1.1) *
        Math.cos(tile.baseY * 1.2 + t * 0.9) *
        q.idleAmp;
      const dist = Math.hypot(tile.baseX - mx, tile.baseY - my);
      const inf = Math.max(0, 1 - dist / q.radius);
      const eased = inf * inf * (3 - 2 * inf);
      const target = idle + eased * q.lift;
      tile.z += (target - tile.z) * DAMP;
      mesh.position.z = tile.z;
    });
  });

  return (
    <group ref={groupRef}>
      {tiles.map((tile) => (
        <mesh
          key={tile.key}
          geometry={tile.geometry}
          material={mat}
          position={[tile.baseX, tile.baseY, 0]}
          castShadow={q.lights}
          receiveShadow={q.lights}
        />
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[3, 4, 6]}
        intensity={0.85}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-4, -2, 4]} intensity={0.25} />
    </>
  );
}

export default function PhotoReveal({ src }) {
  const isMobile = useIsMobile();
  const [texture, setTexture] = useState(null);
  const [aspect, setAspect] = useState(1);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const wrapRef = useRef();

  // perfil de qualidade conforme o dispositivo
  const q = useMemo(() => {
    if (isMobile) {
      // MODO ECONÔMICO (celular): menos cubos, sem luz/sombra, efeito mais suave
      return { grid: 12, radius: 0.6, lift: 0.7, idleAmp: 0.03, lights: false };
    }
    // DESKTOP completo
    return { grid: 20, radius: 0.52, lift: 1.0, idleAmp: 0.04, lights: true };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile === null) return; // espera detectar antes de carregar a textura
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setAspect(t.image.width / t.image.height);
      setTexture(t);
    });
  }, [src, isMobile]);

  function updateFromClient(cx, cy) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pointer.current.x = ((cx - r.left) / r.width) * 2 - 1;
    pointer.current.y = -(((cy - r.top) / r.height) * 2 - 1);
  }
  const onMouse = (e) => { updateFromClient(e.clientX, e.clientY); pointer.current.active = true; };
  const onTouch = (e) => { if (e.touches?.length) { updateFromClient(e.touches[0].clientX, e.touches[0].clientY); pointer.current.active = true; } };
  const onEnd = () => { pointer.current.active = false; };

  // enquanto detecta o dispositivo, mostra um placeholder neutro
  if (isMobile === null) {
    return <div style={{ height: "80%", minHeight: 480, background: "#0b0b10", borderRadius: 14 }} />;
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouse}
      onMouseLeave={onEnd}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={onEnd}
      style={{ height: "80%", minHeight: 480, touchAction: "none" }}
    >
      <Canvas
        shadows={q.lights}
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <color attach="background" args={["#0b0b10"]} />
        {q.lights && <Lights />}
        {texture && <TilesMesh texture={texture} pointer={pointer} aspect={aspect} q={q} />}
      </Canvas>
    </div>
  );
}