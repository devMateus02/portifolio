import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Foto NÍTIDA inteira (textura real) dividida em cubos grandes.
 * - Idle: onda sutil percorre os cubos.
 * - Cursor: a foto "se quebra" — os cubos sob o cursor sobem em 3D.
 * Cada cubo carrega seu pedaço REAL da imagem via UV, sem perda de qualidade.
 *
 * Uso: <PhotoReveal src="/eu.jpg" />
 */
const GRID = 20;        // poucos cubos = quadrados BEM grandes e visíveis
const RADIUS = 0.52;     // raio de influência do cursor
const LIFT = 1.0;       // o quanto o cubo sobe ao reagir ao cursor
const IDLE_AMP = 0.04;  // amplitude da onda no repouso (bem sutil)
const DAMP = 0.18;      // suavidade
const PLANE = 6;        // tamanho da foto na cena
const GAP = 1;       // vão leve entre cubos (mostra que "quebrou")

/* --- Implementação leve e correta: um mesh por cubo (ok até ~600 cubos) --- */
function TilesMesh({ texture, pointer, aspect }) {
  const groupRef = useRef();
  const { viewport } = useThree();

  const cols = GRID;
  const rows = Math.max(1, Math.round(GRID / aspect));
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

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.75,
        metalness: 0,
      }),
    [texture]
  );

  useFrame(({ clock }) => {
    const grp = groupRef.current;
    if (!grp) return;
    const t = clock.getElapsedTime();
    const mx = pointer.current.active
      ? (pointer.current.x * viewport.width) / 2
      : 99999;
    const my = pointer.current.active
      ? (pointer.current.y * viewport.height) / 2
      : 99999;

    grp.children.forEach((mesh, i) => {
      const tile = tiles[i];
      // onda idle sutil
      const idle =
        Math.sin(tile.baseX * 1.2 + t * 1.1) *
        Math.cos(tile.baseY * 1.2 + t * 0.9) *
        IDLE_AMP;
      // reação ao cursor
      const dist = Math.hypot(tile.baseX - mx, tile.baseY - my);
      const inf = Math.max(0, 1 - dist / RADIUS);
      const eased = inf * inf * (3 - 2 * inf);
      const target = idle + eased * LIFT;
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
          castShadow
          receiveShadow
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
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
  const [texture, setTexture] = useState(null);
  const [aspect, setAspect] = useState(1);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const wrapRef = useRef();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace; // cor fiel
      setAspect(t.image.width / t.image.height);
      setTexture(t);
    });
  }, [src]);

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

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouse}
      onMouseLeave={onEnd}
      onTouchStart={onTouch}
      onTouchMove={onTouch}
      onTouchEnd={onEnd}
      style={{ width: "100%", height: "100%", minHeight: 480, touchAction: "none" }}
    >
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 40 }} gl={{ antialias: true }}>
        <color attach="background" args={["#0b0b10"]} />
        <Lights />
        {texture && <TilesMesh texture={texture} pointer={pointer} aspect={aspect} />}
      </Canvas>
    </div>
  );
}