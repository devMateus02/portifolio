"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
const TRAIL = isMobile ? 20 : 60;   // mobile leve, desktop completo
const RADIUS = isMobile ?0.06 :0.10;
const SOFT = 0.10;
const LERP = 0.14;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uBase;
  uniform sampler2D uReveal;
  uniform sampler2D uTextFill;
  uniform sampler2D uTextStroke;
  uniform vec2 uRes;
  uniform vec2 uPhotoSize;
  uniform vec2 uPhotoPos;
  uniform vec2 uTrail[${TRAIL}];
  uniform float uTrailA[${TRAIL}];
  uniform float uRadius;
  uniform float uSoft;
  uniform float uDebug;

  void main() {
    vec2 frag = vUv * uRes;

    // textos (vUv direto; as texturas já estão no mesmo espaço da tela)
    vec4 tFill = texture2D(uTextFill, vUv);
    vec4 tStroke = texture2D(uTextStroke, vUv);

   vec2 local = (frag - uPhotoPos) / uPhotoSize;
    bool inside = local.x >= 0.0 && local.x <= 1.0 && local.y >= 0.0 && local.y <= 1.0;

    vec4 outc = tFill;

  if (inside) {
      vec2 uv = local;
      vec4 bw = texture2D(uBase, uv);
      vec4 col = texture2D(uReveal, uv);

      float body = bw.a;   // alpha da imagem: 1 = corpo, 0 = fundo recortado

      float reveal = 0.0;
      for (int i = 0; i < ${TRAIL}; i++) {
        float d = distance(frag, uTrail[i]) / (uRadius * uRes.y);
        reveal = max(reveal, smoothstep(1.0, 1.0 - uSoft, d) * uTrailA[i]);
      }
      vec4 photo = mix(bw, col, reveal);

      vec4 onBody = photo;
      onBody.rgb = mix(onBody.rgb, tStroke.rgb, tStroke.a);
      onBody.a = max(photo.a, tStroke.a);

      vec4 onBg = tFill;

      outc = mix(onBg, onBody, body);
    }

    if (uDebug > 0.5) {
      float dm = distance(frag, uTrail[0]);
      if (dm < 6.0) outc = vec4(0.0, 1.0, 0.0, 1.0);
    }
    gl_FragColor = outc;
}
`;

function Plane({ baseSrc, revealSrc, debug }) {
  const { gl, size } = useThree();
  const matRef = useRef();
  const [tex, setTex] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all([loader.loadAsync(baseSrc), loader.loadAsync(revealSrc)]).then(([b, r]) => {
      [b, r].forEach((t) => { t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; });
      setTex({ base: b, reveal: r, w: b.image.width, h: b.image.height });
    });
  }, [baseSrc, revealSrc]);

  // texturas de texto (refeitas no resize)
  const textRef = useRef({ fill: null, stroke: null });

  function buildText(W, H) {
  const mob = W < 1024;
  const mk = (mode) => {
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");
    // escala pela largura no mobile (evita fonte gigante em tela estreita)
    const fs = mob
      ? Math.min(W * 0.11, H * 0.10, 64)
      : Math.min(H * 0.20, 150);
    c.font = `750 ${fs}px system-ui, sans-serif`;
    c.textBaseline = "top";
    if (mode === "fill") c.fillStyle = "#ffffff";
    else { c.strokeStyle = "#aa1bfd"; c.lineWidth = 2; }

    const yTop = mob ? H * 0.20 : H * 0.28;
    const yBot = mob ? H * 0.30 : H * 0.72;

    c.textAlign = "left";
    mode === "fill" ? c.fillText("MATEUS", W * 0.05, yTop) : c.strokeText("MATEUS", W * 0.05, yTop);

    c.textAlign = "right";
    mode === "fill" ? c.fillText("CELESTINO", W * 0.95, yBot) : c.strokeText("CELESTINO", W * 0.95, yBot);

    const t = new THREE.CanvasTexture(cv);
    t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
    return t;
  };
  textRef.current.fill?.dispose?.();
  textRef.current.stroke?.dispose?.();
  textRef.current.fill = mk("fill");
  textRef.current.stroke = mk("stroke");
}

  const uniforms = useMemo(() => ({
    uBase: { value: null },
    uReveal: { value: null },
    uTextFill: { value: null },
    uTextStroke: { value: null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uPhotoSize: { value: new THREE.Vector2(1, 1) },
    uPhotoPos: { value: new THREE.Vector2(0, 0) },
    uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector2(-9999, -9999)) },
    uTrailA: { value: new Array(TRAIL).fill(0) },
    uRadius: { value: RADIUS },
    uSoft: { value: SOFT },
    uDebug: { value: 0 },
  }), []);

  const mouse = useRef({ x: -9999, y: -9999, inside: false });
  const pos = useRef({ x: 0, y: 0 });
  const trail = useRef(Array.from({ length: TRAIL }, () => ({ x: -9999, y: -9999 })));
const parallax = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const el = gl.domElement;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.inside = true;
    };
    const touch = (e) => {
      const t = e.touches[0];
      const r = el.getBoundingClientRect();
      mouse.current.x = t.clientX - r.left;
      mouse.current.y = t.clientY - r.top;
      mouse.current.inside = true;
    };
    const windowLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) mouse.current.inside = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchend", () => { mouse.current.inside = false; }, { passive: true });
    document.addEventListener("mouseout", windowLeave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchstart", touch);
      document.removeEventListener("mouseout", windowLeave);
    };
  }, [gl]);

  // reconstrói o texto quando o tamanho muda
  const lastSize = useRef({ w: 0, h: 0 });
  useFrame(() => {
    if (!matRef.current || !tex) return;
    const u = matRef.current.uniforms;
    const W = size.width, H = size.height;

    if (W !== lastSize.current.w || H !== lastSize.current.h) {
      buildText(W, H);
      lastSize.current = { w: W, h: H };
    }

  const ir = tex.w / tex.h;
const mob = W < 1024;
// no mobile limita pela LARGURA pra não estourar
const dw = mob ? Math.min(W * 1.6, H * ir * 1.2) : Math.min(H * 1.25, 1260) * ir;
const dh = dw / ir;
const dx = (W - dw) / 2 + (mob ? 50 :0);
const dyTop = (H - dh) / 2 + (mob ? 90 : 70);
   
   // parallax só quando o mouse já está na tela
    const PARALLAX = 25;
    let targetX = 0, targetY = 0;
    if (!mob && mouse.current.inside) {
      targetX = (mouse.current.x / W - 0.5) * 2 * PARALLAX;
      targetY = (mouse.current.y / H - 0.5) * 1 * PARALLAX;
    }
    parallax.current.x += (targetX - parallax.current.x) * 0.06;
    parallax.current.y += (targetY - parallax.current.y) * 0.02;

    const px = dx + parallax.current.x;
    const pyTop = dyTop + parallax.current.y;

    u.uBase.value = tex.base;
    u.uReveal.value = tex.reveal;
    u.uTextFill.value = textRef.current.fill;
    u.uTextStroke.value = textRef.current.stroke;
    u.uRes.value.set(W, H);
    u.uPhotoSize.value.set(dw, dh);
    u.uPhotoPos.value.set(px, H - pyTop - dh);   // usa px/pyTop com parallax
    u.uDebug.value = debug ? 1 : 0;

    pos.current.x += (mouse.current.x - pos.current.x) * LERP;
    pos.current.y += (mouse.current.y - pos.current.y) * LERP;
    const tr = trail.current;
    for (let i = TRAIL - 1; i > 0; i--) { tr[i].x = tr[i - 1].x; tr[i].y = tr[i - 1].y; }
    tr[0].x = pos.current.x; tr[0].y = pos.current.y;

    for (let i = 0; i < TRAIL; i++) {
      u.uTrail.value[i].set(tr[i].x, H - tr[i].y);
      u.uTrailA.value[i] = mouse.current.inside ? (1 - i / TRAIL) : 0;
    }
  });

  if (!tex) return null;
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function FluidPortrait({
  baseSrc = "/hero_camada.png",
  revealSrc = "/hero_base.png",
  debug = false,
}) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <Canvas
      orthographic
      gl={{ alpha: true, antialias: !mobile }}     // antialias só no desktop
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={mobile ? 1 : [1, 2]}                     // dpr 1 no mobile, até 2 no desktop
    >
      <Plane baseSrc={baseSrc} revealSrc={revealSrc} debug={debug} />
    </Canvas>
  );
}