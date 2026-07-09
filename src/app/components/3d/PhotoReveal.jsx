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

/*
OTIM: antes cada cubo era um <mesh> próprio → ~400 draw calls por frame
(e ~800 com sombras, porque o shadow pass redesenha tudo). Agora é UM
InstancedMesh: 1 draw call para o grid inteiro. O recorte da foto por
cubo, que antes era feito com UVs únicos por geometria, virou um
atributo por instância (uvRect) aplicado com um micro-patch no shader.
Visual 100% idêntico.
*/
function TilesMesh({ texture, pointer, aspect, q }) {
  const instRef = useRef();
  const { viewport } = useThree();

  const cols = q.grid;
  const rows = Math.max(1, Math.round(q.grid / aspect));
  const planeW = PLANE;
  const planeH = PLANE / aspect;
  const cellW = planeW / cols;
  const cellH = planeH / rows;
  const count = cols * rows;

  // geometria única compartilhada por todas as instâncias
  const { geometry, tiles } = useMemo(() => {
    const g = new THREE.BoxGeometry(cellW * GAP, cellH * GAP, cellW * 0.05);
    // face frontal mantém uv 0..1 (o uvRect por instância recorta a região);
    // faces laterais colapsam pro centro da região — igual ao original
    const uv = g.attributes.uv;
    for (let f = 0; f < 16; f++) uv.setXY(f, 0.5, 0.5);
    for (let f = 20; f < 24; f++) uv.setXY(f, 0.5, 0.5);
    uv.needsUpdate = true;

    const arr = [];
    const uvRect = new Float32Array(count * 4);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = (x - cols / 2 + 0.5) * cellW;
        const py = (y - rows / 2 + 0.5) * cellH;
        // região da foto desta instância: offset (u0,v0) + escala (1/cols, 1/rows)
        uvRect[i * 4] = x / cols;
        uvRect[i * 4 + 1] = y / rows;
        uvRect[i * 4 + 2] = 1 / cols;
        uvRect[i * 4 + 3] = 1 / rows;
        arr.push({ baseX: px, baseY: py, z: 0 });
        i++;
      }
    }
    g.setAttribute("uvRect", new THREE.InstancedBufferAttribute(uvRect, 4));
    return { geometry: g, tiles: arr };
  }, [cols, rows, cellW, cellH, count]);

  // material mais barato no mobile (Basic = sem cálculo de luz)
  const mat = useMemo(() => {
    const m = q.lights
      ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.75, metalness: 0 })
      : new THREE.MeshBasicMaterial({ map: texture });

    // OTIM: patch mínimo no shader pra aplicar o uvRect por instância.
    // ATENÇÃO: no onBeforeCompile os #include ainda NÃO foram expandidos,
    // então não dá pra procurar "vMapUv" no código — detectamos pela
    // versão: r151+ usa vMapUv, anteriores usam vUv.
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        "attribute vec4 uvRect;\n#include <common>"
      );
      const newUv = parseInt(THREE.REVISION, 10) >= 151;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <uv_vertex>",
        newUv
          ? "#include <uv_vertex>\n#ifdef USE_MAP\n\tvMapUv = uvRect.xy + vMapUv * uvRect.zw;\n#endif"
          : "#include <uv_vertex>\n#ifdef USE_UV\n\tvUv = uvRect.xy + vUv * uvRect.zw;\n#endif"
      );
    };
    m.customProgramCacheKey = () => "photo-reveal-uv-rect";
    return m;
  }, [texture, q.lights]);

  // libera memória ao desmontar
  useEffect(() => {
    return () => {
      geometry.dispose();
      mat.dispose();
    };
  }, [geometry, mat]);

  // dummy reutilizado pra compor as matrizes das instâncias (zero alocação/frame)
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const inst = instRef.current;
    if (!inst) return;
    const t = clock.getElapsedTime();
    const mx = pointer.current.active ? (pointer.current.x * viewport.width) / 2 : 99999;
    const my = pointer.current.active ? (pointer.current.y * viewport.height) / 2 : 99999;

    for (let i = 0; i < tiles.length; i++) {
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

      dummy.position.set(tile.baseX, tile.baseY, tile.z);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instRef}
      args={[geometry, mat, count]}
      castShadow={q.lights}
      receiveShadow={q.lights}
      // OTIM: com as instâncias se movendo em z, desligar o culling evita
      // recomputar bounding volumes (o grid ocupa a tela toda mesmo)
      frustumCulled={false}
    />
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
    let alive = true; // OTIM: não seta state após unmount
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (t) => {
      if (!alive) { t.dispose(); return; }
      t.colorSpace = THREE.SRGBColorSpace;
      setAspect(t.image.width / t.image.height);
      setTexture(t);
    });
    return () => { alive = false; };
  }, [src, isMobile]);

  // OTIM: libera a textura da GPU quando trocar ou desmontar
  useEffect(() => {
    return () => texture?.dispose?.();
  }, [texture]);

  // OTIM: pausa o render loop quando o componente sai do viewport ou a
  // aba fica oculta — a onda idle roda contínua, então isso é o que
  // impede o grid de consumir GPU durante o scroll do resto da página
  const [frameloop, setFrameloop] = useState("always");
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let visible = true;

    const apply = () =>
      setFrameloop(visible && document.visibilityState === "visible" ? "always" : "never");

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; apply(); },
      { threshold: 0 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [isMobile]); // re-observa depois que o placeholder vira canvas

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
        frameloop={frameloop}
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance", stencil: false }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <color attach="background" args={["#0b0b10"]} />
        {q.lights && <Lights />}
        {texture && <TilesMesh texture={texture} pointer={pointer} aspect={aspect} q={q} />}
      </Canvas>
    </div>
  );
}