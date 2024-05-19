"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { AnimationAction, Group, MathUtils } from "three";

const filePath = "/cube_explosion.glb";

useGLTF.preload(filePath);

export default function Cube({
  setHidden,
}: {
  setHidden: (isClick: boolean) => void;
}) {
  const { nodes, animations, scene } = useGLTF(filePath);
  const { actions } = useAnimations(animations, scene);
  const groupRef = useRef<Group>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 20 });

  useFrame(() => {
    groupRef.current?.rotateY(MathUtils.degToRad(0.2));
    Object.keys(actions).forEach((key) => {
      const action = actions[key] as AnimationAction;
      action.play().paused = true;
      action.time = spring.get();
    });

    if (spring.get() < 0.1) {
      nodes["Cube"].visible = true;
    } else {
      nodes["Cube"].visible = false;
    }
  });

  const handleOnPointerUp = () => {
    motionVal.set(0);

    setTimeout(() => {
      setHidden(true);
    }, 1000);
  };

  const handleOnPointerDown = () => {
    motionVal.set(1);
    setHidden(false);
  };

  return (
    <group
      ref={groupRef}
      rotation={[0.5, 0, 0]}
      onPointerUp={handleOnPointerUp}
      onPointerDown={handleOnPointerDown}
    >
      <primitive object={scene} />
    </group>
  );
}
