"use client";

import {
  Image,
  Line,
  Scroll,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { Canvas, Color, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { proxy, useSnapshot } from "valtio";
import { NavLink } from "@/components/Nav";

type ImageProps = Omit<JSX.IntrinsicElements["mesh"], "scale"> & {
  segments?: number;
  scale: THREE.Vector3Tuple;
  color?: Color;
  zoom?: number;
  radius?: number;
  grayscale?: number;
  toneMapped?: boolean;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  index: number;
  position: THREE.Vector3Tuple;
  url: string;
};

type StateProps = {
  clicked: number | null;
  urls: string[];
};

const geometry = [new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)];

const state: StateProps = proxy({
  clicked: null,
  urls: [1, 2, 3, 4].map((u) => `/images/${u}.jpg`),
});

export default function ScrollPage() {
  return (
    <div className="realative w-full h-screen">
      <div className="absolute top-5 left-5 z-10">
        <NavLink href="/">Back to Home</NavLink>
      </div>
      <Suspense fallback={null}>
        <Canvas
          gl={{ antialias: false }}
          dpr={[1, 1.5]}
          onPointerMissed={() => (state.clicked = null)}
        >
          <Items />
        </Canvas>
      </Suspense>
    </div>
  );
}

function Minimap() {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  const { urls } = useSnapshot(state);
  const { height } = useThree((state) => state.viewport);

  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      const y = scroll.curve(
        index / urls.length - 1.5 / urls.length,
        4 / urls.length
      );
      easing.damp(child.scale, "y", 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {urls.map((_, i) => (
        <Line
          key={i}
          points={geometry}
          color={"white"}
          position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]}
        />
      ))}
    </group>
  );
}

function Item({ index, position, scale, ...props }: ImageProps) {
  const ref = useRef<any>(null!);
  const scroll = useScroll();
  const { clicked, urls } = useSnapshot(state);
  const [hovered, setHovered] = useState(false);
  const click = () => (state.clicked = index === clicked ? null : index);
  const over = () => setHovered(true);
  const out = () => setHovered(false);

  useFrame((state, delta) => {
    const y = scroll.curve(
      index / urls.length - 1.5 / urls.length,
      4 / urls.length
    );
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta
    );

    if (clicked !== null && index < clicked)
      easing.damp(ref.current.position, "x", position[0] - 2, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(ref.current.position, "x", position[0] + 2, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(ref.current.position, "x", position[0], 0.15, delta);
    easing.damp(
      ref.current.material,
      "grayscale",
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta
    );
    easing.dampC(
      ref.current.material.color,
      hovered || clicked === index ? "white" : "#aaa",
      hovered ? 0.3 : 0.15,
      delta
    );
  });

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      ref={ref}
      {...props}
      position={position}
      scale={[scale[0], scale[1]]}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
}

function Items({ w = 0.7, gap = 0.15 }) {
  const { urls } = useSnapshot(state);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={(width - xW + urls.length * xW) / width}
      style={{ overflow: "hidden" }}
    >
      <Minimap />
      <Scroll>
        {urls.map((url, i) => (
          <Item
            key={i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 4, 1]}
            url={url}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
}
