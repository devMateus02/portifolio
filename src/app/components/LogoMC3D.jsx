"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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
    window.addEventListener("resize", check);
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
                bevelSize: 2.2,
                bevelSegments: 8,
              },
            ]}
          />
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.18} />
        </mesh>
      ))}

      <mesh position={[499, 120, 42]} castShadow>
        <sphereGeometry args={[20, 48, 108]} />
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

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    const targetRotY = mouse.current.x * 0.15;
    const targetRotX = -mouse.current.y * 0.15;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.08);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.05);
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

  return (
    <div className="w-full h-full">
      {/* 1️⃣ ativa sombras no renderer */}
      <Canvas shadows camera={{ position: config.cameraPos, fov: 45 }}>
        <ambientLight intensity={1} />

        {/* 2️⃣ luz que projeta sombra (castShadow) */}
        <directionalLight
          position={[3, 8, 6]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
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