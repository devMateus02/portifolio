"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

const svgMarkup = `<svg width="520" height="286" viewBox="0 0 520 286" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M273.2 7.79998V283.8H245.2V63.4L146.8 283.8H126.4L28 64.2V283.8H0V7.79998H29.6L136.4 247L243.2 7.79998H273.2Z" fill="white"/>
<path d="M247.262 142.8C247.262 115.333 253.263 90.8 265.263 69.2C277.263 47.3333 293.662 30.4 314.462 18.4C335.262 6.13333 358.462 0 384.062 0C415.263 0 441.929 7.46667 464.062 22.4C486.462 37.0667 502.729 57.8667 512.862 84.8H480.063C472.063 65.8667 459.796 51.0667 443.263 40.4C426.996 29.7333 407.263 24.4 384.062 24.4C363.529 24.4 344.996 29.2 328.462 38.8C312.196 48.4 299.396 62.2667 290.062 80.4C280.729 98.2667 276.062 119.067 276.062 142.8C276.062 166.533 280.729 187.333 290.062 205.2C299.396 223.067 312.196 236.8 328.462 246.4C344.996 256 363.529 260.8 384.062 260.8C407.263 260.8 426.996 255.6 443.263 245.2C459.796 234.533 472.063 219.867 480.063 201.2H512.862C502.729 227.867 486.462 248.533 464.062 263.2C441.663 277.867 414.996 285.2 384.062 285.2C358.462 285.2 335.262 279.2 314.462 267.2C293.662 254.933 277.263 238 265.263 216.4C253.263 194.8 247.262 170.267 247.262 142.8Z" fill="white"/>
</svg>`; // igual ao seu

// hook simples de media query
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

function MCLogoMesh({ scale, position, rotation }) {
  const shapes = useMemo(() => {
    const loader = new SVGLoader();
    const data = loader.parse(svgMarkup);
    return data.paths.flatMap((path) =>
      SVGLoader.createShapes(path).map((shape) => ({
        shape,
        color: path.color,
      }))
    );
  }, []);

  return (
    <group scale={scale} rotation={rotation} position={position}>
      {shapes.map((item, index) => (
        <mesh key={index} castShadow>
          <extrudeGeometry
            args={[
              item.shape,
              {
                depth: 45,
                bevelEnabled: true,
                bevelThickness: 4.5,
                // OTIM: bevel de 2.2 unidades é fino demais pra 8 segmentos
                // fazerem diferença — 4 corta a malha pela metade sem
                // mudança visível (se notar algo, volta pra 8)
                bevelSize: 2.2,
                bevelSegments: 4,
              },
            ]}
          />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.18} />
        </mesh>
      ))}

      <mesh position={[499, 120, 42]} castShadow>
        {/* OTIM: era [20, 48, 108] (~10k triângulos) — quase certeza que o 108
            era typo; 32x32 é visualmente idêntico pra uma esfera desse tamanho */}
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#5905b3"
          emissive="#5905b3"
          emissiveIntensity={0.1}
          metalness={0.5}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

function MouseFollow({ children }) {
  const group = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  // OTIM: com frameloop="demand", o invalidate() é o que pede novos frames
  const { invalidate } = useThree();

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate(); // acorda o render loop
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [invalidate]);

  useFrame(() => {
    const targetRotY = mouse.current.x * 0.15;
    const targetRotX = -mouse.current.y * 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.08);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.05);

    // OTIM: enquanto o lerp não convergiu, pede mais um frame;
    // quando assenta, o loop dorme sozinho (0% de GPU em repouso)
    if (
      Math.abs(group.current.rotation.y - targetRotY) > 0.0005 ||
      Math.abs(group.current.rotation.x - targetRotX) > 0.0005
    ) {
      invalidate();
    }
  });

  return <group ref={group}>{children}</group>;
}

export default function LogoMC3D() {
  const isMobile = useIsMobile();

  const config = isMobile
    ? {
        scale: [0.003, -0.0032, 0.0032],
        position: [-3, -1.60, -9],
        rotation: [0.13, 0.15, 0.01],
        cameraPos: [0, 2, 9],
      }
    : {
        scale: [0.007, -0.006, 0.006],
        position: [-5, 1, -3],
        rotation: [0.13, 0.15, 0.01],
        cameraPos: [0, 4, 8],
      };

  // OTIM: fora do viewport / aba oculta, o loop trava em "never".
  // Visível, usa "demand": só renderiza quando o mouse mexe ou o
  // lerp ainda está assentando — em repouso a cena é estática mesmo.
  const wrapRef = useRef(null);
  const [frameloop, setFrameloop] = useState("demand");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let visible = true;

    const apply = () =>
      setFrameloop(visible && document.visibilityState === "visible" ? "demand" : "never");

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
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full">
      {/* 1️⃣ ativa sombras no renderer */}
      <Canvas
        shadows
        frameloop={frameloop}
        camera={{ position: config.cameraPos, fov: 45 }}
        // OTIM: dpr máx 1.5 (era o padrão até 2) — ~44% menos fragmentos em
        // tela retina; antialias fica LIGADO porque aqui tem arestas 3D reais
        dpr={[1, 1.5]}
        gl={{ antialias: true, stencil: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />

        {/* 2️⃣ luz que projeta sombra (castShadow) */}
        <directionalLight
          position={[3, 8, 6]}
          intensity={2}
          castShadow
          // OTIM: 1024 é suficiente pra uma sombra suave no chão
          // (2048 = 4x mais memória/preenchimento por nada aqui)
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={10}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        <pointLight position={[-4, 2, 4]} intensity={2} color="#5905b3" />

        <Environment preset="city" />

        <Center>
          <MouseFollow>
            <MCLogoMesh
              scale={config.scale}
              position={config.position}
              rotation={config.rotation}
            />
          </MouseFollow>
        </Center>

        {/* 3️⃣ plano no chão que recebe a sombra */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[50, 50]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>
      </Canvas>
    </div>
  );
}