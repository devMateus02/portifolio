"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const svgMarkup = `
<svg width="520" height="286" viewBox="0 0 520 286" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M273.2 7.79998V283.8H245.2V63.4L146.8 283.8H126.4L28 64.2V283.8H0V7.79998H29.6L136.4 247L243.2 7.79998H273.2Z" fill="white"/>
<path d="M247.262 142.8C247.262 115.333 253.263 90.8 265.263 69.2C277.263 47.3333 293.662 30.4 314.462 18.4C335.262 6.13333 358.462 0 384.062 0C415.263 0 441.929 7.46667 464.062 22.4C486.462 37.0667 502.729 57.8667 512.862 84.8H480.063C472.063 65.8667 459.796 51.0667 443.263 40.4C426.996 29.7333 407.263 24.4 384.062 24.4C363.529 24.4 344.996 29.2 328.462 38.8C312.196 48.4 299.396 62.2667 290.062 80.4C280.729 98.2667 276.062 119.067 276.062 142.8C276.062 166.533 280.729 187.333 290.062 205.2C299.396 223.067 312.196 236.8 328.462 246.4C344.996 256 363.529 260.8 384.062 260.8C407.263 260.8 426.996 255.6 443.263 245.2C459.796 234.533 472.063 219.867 480.063 201.2H512.862C502.729 227.867 486.462 248.533 464.062 263.2C441.663 277.867 414.996 285.2 384.062 285.2C358.462 285.2 335.262 279.2 314.462 267.2C293.662 254.933 277.263 238 265.263 216.4C253.263 194.8 247.262 170.267 247.262 142.8Z" fill="white"/>
</svg>
`;

function MCLogoMesh() {
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



function MouseFollow({ children }) {
  const group = useRef();

  useFrame((state) => {
    const x = state.mouse.x;
    const y = state.mouse.y;

    const targetRotY = x * 0.25;
    const targetRotX = -y * 0.15;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotY,
      0.05
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotX,
      0.05
    );
  });

  return <group ref={group}>{children}</group>;
}

  return (
    <group  scale={[0.018, -0.02, 0.02]}   rotation={[
    0.25, // inclinação para baixo
    -0.55,   // gira para mostrar profundidade
    -.05
  ]} position={[-5, 3, -2]}>
      {shapes.map((item, index) => (
        <mesh key={index}>
          <extrudeGeometry
            args={[
              item.shape,
              {
                depth: 35,
                bevelEnabled: true,
                bevelThickness: 5.5,
                bevelSize: 2.2,
                bevelSegments: 8,
              },
            ]}
          />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.4}
            roughness={0.18}
          />
        </mesh>
      ))}

      {/* Bolinha laranja */}
      <mesh position={[499, 120, 12]}>
        <sphereGeometry args={[20, 48, 48]} />
        <meshStandardMaterial
          color="#5905b3"
          emissive="#5905b3"
          emissiveIntensity={0.10}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

export default function LogoMC3D() {
  return (
    <div className="w-[50vw] h-[50vh] ">
      <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
        <ambientLight intensity={1} />

        <directionalLight position={[3, 4, 6]} intensity={2} />
        <pointLight position={[-4, 2, 4]} intensity={2} color="#5905b3" />

        <Environment preset="city" />

        <Center>
          <MCLogoMesh />
        </Center>

        <OrbitControls enableZoom={false} />
        <OrbitControls enablePan={false} />
        <OrbitControls enableRotate={false} />
      </Canvas>
    </div>
  );
}