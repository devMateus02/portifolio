"use client";

/**
 * ContactParticles — partículas de vento que formam shapes por step.
 *
 * Props:
 *  - stepIndex: -1 = vento livre (intro) | 0..5 = steps do form | 6 = enviado
 *  - dark: false = tema claro (partículas pretas) | true = escuro (roxas)
 *
 * Uso: <ContactParticles stepIndex={particleStep} dark={isDark} />
 * Posicione o wrapper como fixed inset-0 pointer-events-none,
 * entre o fundo (clip-path) e a UI do formulário.
 *
 * Física 100% imperativa dentro do useFrame (zero re-render por frame).
 * Transições de shape/tema tweenadas com GSAP sobre um objeto em ref.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const COUNT = 8000;
const BOUNDS = { x: 30, y: 16, z: 14 };

/* ================= SAMPLER GENÉRICO =================
   Desenha num canvas 2D e converte em nuvem de pontos. */
function sampleCanvas(drawFn, worldWidth, cw = 900, ch = 600) {
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  drawFn(ctx, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts = [];
  for (let y = 0; y < ch; y += 2)
    for (let x = 0; x < cw; x += 2)
      if (data[(y * cw + x) * 4 + 3] > 128) pts.push([x, y]);

  const arr = new Float32Array(COUNT * 3);
  const scale = worldWidth / cw;
  for (let i = 0; i < COUNT; i++) {
    const [px, py] = pts[Math.floor(Math.random() * pts.length)];
    arr[i * 3] = (px - cw / 2) * scale + (Math.random() - 0.5) * 0.15;
    arr[i * 3 + 1] = -(py - ch / 2) * scale + (Math.random() - 0.5) * 0.15;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
  }
  return arr;
}

/* ================= DESENHOS POR STEP ================= */

// 01 · SOBRE VOCÊ → impressão digital (identidade)
function drawFingerprint(ctx, cw, ch) {
  const cx = cw / 2, cy = ch / 2;
  ctx.lineWidth = 15;
  ctx.lineCap = "round";
  for (let r = 26; r < 250; r += 22) {
    let a = Math.random() * Math.PI * 2;
    while (a < Math.PI * 2 + 1) {
      const len = 0.6 + Math.random() * 1.6;
      const gap = 0.25 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r + Math.sin(a * 3) * 6, (r + Math.cos(a * 2) * 6) * 1.18, 0, a, a + len);
      ctx.stroke();
      a += len + gap;
    }
  }
}

// 02 · SERVIÇOS → tags de código
function drawCode(ctx, cw, ch) {
  ctx.font = '800 330px "Consolas", "Courier New", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("</>", cw / 2, ch / 2);
}

// 03 · ORÇAMENTO → R$
function drawMoney(ctx, cw, ch) {
  ctx.font = '900 360px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("R$", cw / 2, ch / 2);
}

// 04 · LINHA DO TEMPO → relógio
function drawClock(ctx, cw, ch) {
  const cx = cw / 2, cy = ch / 2, r = 220;
  ctx.lineWidth = 22;
  ctx.lineCap = "round";
  // aro
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // marcações das horas
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r - 38), cy + Math.sin(a) * (r - 38));
    ctx.lineTo(cx + Math.cos(a) * (r - 12), cy + Math.sin(a) * (r - 12));
    ctx.stroke();
  }
  // ponteiros (10h10)
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(-Math.PI * 0.32) * r * 0.52, cy + Math.sin(-Math.PI * 0.32) * r * 0.52);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(-Math.PI * 0.78) * r * 0.72, cy + Math.sin(-Math.PI * 0.78) * r * 0.72);
  ctx.stroke();
}

// 05 · DETALHES → balão de chat "digitando..."
function drawChatBubble(ctx, cw, ch) {
  const x = 160, y = 110, w = cw - 320, h = ch - 300, r = 90;
  ctx.lineWidth = 22;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 130, y + h - 8);
  ctx.lineTo(x + 100, y + h + 110);
  ctx.lineTo(x + 250, y + h - 8);
  ctx.closePath();
  ctx.fill();
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath();
    ctx.arc(cw / 2 + k * 120, y + h / 2, 34, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 06 · ANÁLISE → lupa (confira seus dados)
function drawMagnifier(ctx, cw, ch) {
  const cx = cw / 2 - 55, cy = ch / 2 - 45, r = 165;
  ctx.lineWidth = 26;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // cabo a 45°
  ctx.lineWidth = 44;
  const a = Math.PI / 4;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12));
  ctx.lineTo(cx + Math.cos(a) * (r + 170), cy + Math.sin(a) * (r + 170));
  ctx.stroke();
}

// ENVIADO → assinatura
function drawMC(ctx, cw, ch) {
  ctx.font = '900 380px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MC", cw / 2, ch / 2);
}

/* ================= CAMPO DE PARTÍCULAS ================= */
function ParticleField({ stepIndex, dark }) {
  const { viewport } = useThree();

  // estado animado por GSAP (lido no useFrame, nunca causa re-render)
  const anim = useRef({ progress: 0, theme: 0 });

  // shapes só existem no client (children do Canvas não rodam no SSR)
  const shapes = useMemo(
    () => [
      null,                               // -1 · intro: vento livre
      sampleCanvas(drawFingerprint, 35),  // 0 · sobre você
      sampleCanvas(drawCode, 35),         // 1 · serviços
      sampleCanvas(drawMoney, 35),        // 2 · orçamento
      sampleCanvas(drawClock, 35),        // 3 · linha do tempo
      sampleCanvas(drawChatBubble, 35),   // 4 · detalhes
      sampleCanvas(drawMagnifier, 35),    // 5 · análise
      sampleCanvas(drawMC,35),           // 6 · enviado
    ],
    []
  );

  const buffers = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;
      sizes[i] = 1.4 + Math.random() * 2.8;
    }
    return { positions, velocities, colors, sizes };
  }, []);

  // Geometria construída imperativamente — evita as diferenças de API
  // do <bufferAttribute> entre versões do R3F (v9 exige args=[...])
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(buffers.colors, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(buffers.sizes, 1));
    return g;
  }, [buffers]);

  const material = useMemo(() => {
    const tex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 32;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(c);
    })();
    return new THREE.ShaderMaterial({
      uniforms: { uTex: { value: tex } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (34.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D uTex;
        varying vec3 vColor;
        void main() {
          float a = texture2D(uTex, gl_PointCoord).a;
          gl_FragColor = vec4(vColor, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  // paletas [lenta, média, rápida]
  const palettes = useMemo(
    () => ({
      light: [new THREE.Color(0xb9b9c2), new THREE.Color(0x55555f), new THREE.Color(0x111116)],
      dark: [new THREE.Color(0x3a3a4a), new THREE.Color(0x7a6bb8), new THREE.Color(0xc084fc)],
      current: [new THREE.Color(), new THREE.Color(), new THREE.Color()],
      tmp: new THREE.Color(),
    }),
    []
  );

  // mouse em NDC (raycast pro plano z=0 acontece no frame)
  const mouse = useRef({ ndc: new THREE.Vector2(10, 10), world: new THREE.Vector3(9999, 9999, 9999), strength: 0 });
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.strength = 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ── GSAP: tween do shape quando o step muda ──
  useEffect(() => {
    const target = stepIndex + 1; // -1 → 0 (vento), 0 → 1 (digital)...
    const tween = gsap.to(anim.current, { progress: target, duration: 1.5, ease: "power2.inOut" });
    return () => tween.kill();
  }, [stepIndex]);

  // ── EXPLOSÃO: ao fechar o form (dark true→false), as partículas
  //    ganham um impulso radial forte e o atrito é reduzido por ~1s
  //    (senão o DRAG normal mata o impulso antes de cobrir a tela) ──
  const prevDark = useRef(dark);
  const burst = useRef(0);      // tempo restante do modo explosão (s)
  const lastOffX = useRef(0);   // deslocamento X atual do shape (telas largas)
  useEffect(() => {
    if (prevDark.current && !dark) {
      const { positions, velocities } = buffers;
      const cx = lastOffX.current; // centro real da forma, não a origem
      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const dx = positions[ix] - cx, dy = positions[ix + 1], dz = positions[ix + 2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
        const power = 60 + Math.random() * 70;
        velocities[ix] += (dx / len) * power + (Math.random() - 0.5) * 25;
        velocities[ix + 1] += (dy / len) * power + (Math.random() - 0.5) * 25;
        velocities[ix + 2] += (dz / len) * power * 0.4 + (Math.random() - 0.5) * 12;
      }
      burst.current = 1.0; // 1s de atrito reduzido
      // corta a atração na hora (sem esperar o tween) pro estouro ser instantâneo
      gsap.killTweensOf(anim.current, "progress");
      anim.current.progress = 0;
    }
    prevDark.current = dark;
  }, [dark, buffers]);

  // ── GSAP: tween do tema (preto ↔ roxo) sincronizado com o clip-path ──
  useEffect(() => {
    const tween = gsap.to(anim.current, {
      theme: dark ? 1 : 0,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        const target = anim.current.theme > 0.55 ? THREE.AdditiveBlending : THREE.NormalBlending;
        if (material.blending !== target) {
          material.blending = target;
          material.needsUpdate = true;
        }
      },
    });
    return () => tween.kill();
  }, [dark, material]);

  const flow = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);

  useFrame((rootState, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = rootState.clock.elapsedTime;
    const { positions, velocities, colors } = buffers;
    const { light, dark: darkPal, current, tmp } = palettes;
    const m = mouse.current;
    const a = anim.current;

    for (let k = 0; k < 3; k++) current[k].copy(light[k]).lerp(darkPal[k], a.theme);

    if (m.strength > 0.001) {
      ray.setFromCamera(m.ndc, rootState.camera);
      ray.ray.intersectPlane(plane, m.world);
    }
    m.strength *= Math.pow(0.35, dt);

    // em telas largas, desloca o shape pra direita pra não ficar atrás do card do form
    const offX = viewport.aspect > 1.25 ? 9.5 : 0;
    lastOffX.current = offX; // usado como centro da explosão

    // modo burst: logo após a explosão, atrito bem menor por ~1s
    // pro impulso levar as partículas até as bordas da tela
    burst.current = Math.max(0, burst.current - dt);
    const bursting = burst.current > 0;

    const p = a.progress;
    const seg = Math.min(Math.floor(p), shapes.length - 2);
    const blend = p - seg;
    const shapeA = shapes[seg];
    const shapeB = shapes[seg + 1];
    const attraction = (shapeA ? 1 : 0) + ((shapeB ? 1 : 0) - (shapeA ? 1 : 0)) * blend;
    const windAmt = bursting ? 0 : 1 - attraction + Math.sin(blend * Math.PI) * 0.35;
    const DRAG = Math.pow(bursting ? 0.45 : 0.015, dt);
    const spring = 14 * attraction;
    const MOUSE_RADIUS = 6, MR2 = MOUSE_RADIUS * MOUSE_RADIUS, MOUSE_FORCE = 50;
    const s = 0.12;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      let px = positions[ix], py = positions[ix + 1], pz = positions[ix + 2];

      // flow field (pseudo curl noise)
      flow.x = 2.6 + Math.sin(py * s * 2.1 + t * 0.7) * 1.4 + Math.cos(pz * s * 1.7 - t * 0.4) * 1.1;
      flow.y = Math.sin(px * s * 1.3 + t * 0.5) * 0.9 + Math.cos(pz * s * 2.3 + t * 0.8) * 0.7;
      flow.z = Math.cos(px * s * 1.9 - t * 0.6) * 1.0 + Math.sin(py * s * 2.7 + t * 0.35) * 0.8;

      let fx = flow.x * windAmt * 3.0;
      let fy = flow.y * windAmt * 3.0;
      let fz = flow.z * windAmt * 3.0;

      if (attraction > 0.001) {
        const ax = (shapeA ? shapeA[ix] + offX : px);
        const ay = (shapeA ? shapeA[ix + 1] : py);
        const az = (shapeA ? shapeA[ix + 2] : pz);
        const bx = (shapeB ? shapeB[ix] + offX : px);
        const by = (shapeB ? shapeB[ix + 1] : py);
        const bz = (shapeB ? shapeB[ix + 2] : pz);
        fx += (ax + (bx - ax) * blend - px) * spring;
        fy += (ay + (by - ay) * blend - py) * spring;
        fz += (az + (bz - az) * blend - pz) * spring;
      }

      // repulsão magnética do mouse
      if (m.strength > 0.01) {
        const dx = px - m.world.x, dy = py - m.world.y, dz = pz - m.world.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < MR2) {
          const d = Math.sqrt(d2) + 0.001;
          let fall = 1 - d / MOUSE_RADIUS;
          fall *= fall;
          const f = (MOUSE_FORCE * fall * m.strength) / d;
          fx += dx * f; fy += dy * f; fz += dz * f;
        }
      }

      velocities[ix] = velocities[ix] * DRAG + fx * dt;
      velocities[ix + 1] = velocities[ix + 1] * DRAG + fy * dt;
      velocities[ix + 2] = velocities[ix + 2] * DRAG + fz * dt;

      px += velocities[ix] * dt;
      py += velocities[ix + 1] * dt;
      pz += velocities[ix + 2] * dt;

      if (attraction < 0.4) {
        if (px > BOUNDS.x) px = -BOUNDS.x;
        if (px < -BOUNDS.x) px = BOUNDS.x;
        if (py > BOUNDS.y) py = -BOUNDS.y;
        if (py < -BOUNDS.y) py = BOUNDS.y;
        if (pz > BOUNDS.z) pz = -BOUNDS.z;
        if (pz < -BOUNDS.z) pz = BOUNDS.z;
      }

      positions[ix] = px; positions[ix + 1] = py; positions[ix + 2] = pz;

      const spd = Math.sqrt(velocities[ix] ** 2 + velocities[ix + 1] ** 2 + velocities[ix + 2] ** 2);
      const kBase = attraction * 0.25;
const kk = Math.min(1, kBase + (1 - kBase) * Math.min(spd / 9, 1));
      if (kk < 0.5) tmp.copy(current[0]).lerp(current[1], kk * 2);
      else tmp.copy(current[1]).lerp(current[2], (kk - 0.5) * 2);
      colors[ix] = tmp.r; colors[ix + 1] = tmp.g; colors[ix + 2] = tmp.b;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aColor.needsUpdate = true;

    // drift suave de câmera por step
    rootState.camera.position.x += (Math.sin(p * 0.6) * 3 - rootState.camera.position.x) * 0.03;
    rootState.camera.position.y = Math.sin(t * 0.2) * 0.7;
    rootState.camera.lookAt(0, 0, 0);
  });

  // frustumCulled={false}: como mutamos os buffers manualmente, o bounding
  // sphere fica desatualizado e o three culla o objeto inteiro sem isso
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ================= WRAPPER COM CANVAS ================= */
export default function ContactParticles({ stepIndex = -1, dark = false, className = "" }) {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 26], fov: 60, near: 0.1, far: 200 }}
      >
        <ParticleField stepIndex={stepIndex} dark={dark} />
      </Canvas>
    </div>
  );
}