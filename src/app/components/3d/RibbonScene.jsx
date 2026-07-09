"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";

/*
=========================================
TEXTO DA ESPIRAL
=========================================
*/
const SPIRAL_TEXT = "Software Developer • Fullstack Developer • WEB DESIGNER • UI/UX DESIGN ";
const REPEAT      = 4; // quantas vezes repete ao longo da espiral

/*


=========================================
ENV MAP
=========================================
*/
function EnvMap() {
  const { scene } = useThree();
  useMemo(() => {
    const W = 1024, H = 512;
    const cvs = document.createElement("canvas");
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext("2d");

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.0,  "#ffffff");
    g.addColorStop(0.15, "#aaaaaa");
    g.addColorStop(0.4,  "#333333");
    g.addColorStop(0.7,  "#0d0d0d");
    g.addColorStop(0.88, "#ff4400");
    g.addColorStop(1.0,  "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const spot = ctx.createRadialGradient(W*.9, H*.15, 0, W*.9, H*.15, H*.5);
    spot.addColorStop(0,   "rgba(205,255,256,0.95)");
    spot.addColorStop(0.4, "rgba(255,255,255,0.2)");
    spot.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, W, H);

    const tex = new THREE.CanvasTexture(cvs);
    tex.mapping  = THREE.EquirectangularReflectionMapping;
    scene.environment = tex;
   
  }, [scene]);
  return null;
}

/*
=========================================
ESPIRAL DE TEXTO
cada caractere é posicionado
individualmente ao longo de
uma hélice 3D — formando a "fita"
=========================================
*/
function TextSpiral() {
  const groupRef = useRef();
  const textRefs = useRef([]);

  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  const chars = useMemo(() => {
    const fullText = SPIRAL_TEXT.repeat(REPEAT);
    const total = fullText.length;

    const RADIUS = 3.5;
    const HEIGHT = 20;
    const TURNS = 5;

    return fullText.split("").map((char, i) => ({
      char,
      index: i,
      total,
      RADIUS,
      HEIGHT,
      TURNS,
    }));
  }, []);

  useFrame(({ clock, camera }) => {
    const time = clock.elapsedTime;

    textRefs.current.forEach((text, i) => {
      if (!text) return;

      const c = chars[i];

      const offset = (time * 0.02) % 1;

      const t = ((c.index / c.total) + offset) % 1;

      if (t > 0.95 || t < 0.05) {
  text.visible = false;
  return;
}

text.visible = true;

      const angle = t * Math.PI * 2 * c.TURNS;

      const x = Math.cos(angle) * c.RADIUS;
      const z = Math.sin(angle) * c.RADIUS;
      const y = -(t - 0.5) * c.HEIGHT;

      const pos = new THREE.Vector3(x, y, z);

      const mouse3D = new THREE.Vector3(
        mouse.current.x * 7,
        mouse.current.y * 5,
        0
      );


      const distance = pos.distanceTo(mouse3D);

      const radius = 3;

      if (distance < radius) {
        const force = (radius - distance) / radius;

        const dir = pos.clone().sub(mouse3D).normalize();

        pos.add(
          dir.multiplyScalar(force * 2.5)
        );

        const scale = 1 + force * 1.5;

        text.scale.lerp(
          new THREE.Vector3(scale, scale, scale),
          0.12
        );
      } else {
        text.scale.lerp(
          new THREE.Vector3(1, 1, 1),
          0.12
        );
      }

      text.position.lerp(pos,0.1);

    text.quaternion.copy(camera.quaternion);

    const opacity = THREE.MathUtils.clamp(
  (-z + 2.5) / 4,
  0,
  1
);

const edgeFade = Math.min(
  t * 20,
  (1 - t) * 20,
  1
);

text.material.opacity = opacity * edgeFade;
    });
  });

  return (
    <group ref={groupRef}>
      {chars.map((c, i) => (
        <Text
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          fontSize={0.68}
          letterSpacing={-5.8}
          color="#fff"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={0.1}
        
       
        >
          {c.char}
        </Text>
      ))}
    </group>
  );
}


/*
=========================================
LUZES
=========================================
*/
function Lights() {
  const orangeRef = useRef();
  useFrame((state) => {
    if (!orangeRef.current) return;
    const t = state.clock.elapsedTime;
    orangeRef.current.intensity = 4 + Math.sin(t * 0.9) * 2;
  });
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 10, 8]}   intensity={4} color="#ffffff" />
      <directionalLight position={[8, 4, 4]}  intensity={1.5} color="#aac4ff" />
      <pointLight ref={orangeRef} position={[0, -6, 4]} color="#ff4400" intensity={5} distance={24} />
      <pointLight position={[0, 6, 4]} color="#ffffff" intensity={1.5} distance={16} />
    </>
  );
}

/*
=========================================
EXPORT
=========================================
*/
export default function RibbonScene() {
  return (
    <Canvas
     camera={{ position: [0, 0, 20], fov: 42 }}
  gl={{
    alpha: true,
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.2,
  }}
  onCreated={({ gl }) => {
    gl.setClearColor(0x000000, 0);
  }}
    >
      <EnvMap />
      <Lights />
      <TextSpiral />
    </Canvas>
  );
}