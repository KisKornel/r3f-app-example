"use client";

import { Center } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Cube from "./cube";

export default function Scene() {
  const [hidden, setHidden] = useState(true);

  return (
    <>
      <div className="absolute top-28 w-full flex justify-center items-center text-white">
        {hidden ? (
          <span className="text-xl font-semibold text-slate-600 animate-pulse">
            Press the cube!
          </span>
        ) : null}
      </div>
      <Canvas gl={{ antialias: true }} dpr={[1, 1.5]}>
        <directionalLight position={[-5, -2, 10]} intensity={5} />
        <ambientLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Center>
            <Cube setHidden={setHidden} />
          </Center>
        </Suspense>
      </Canvas>
    </>
  );
}
