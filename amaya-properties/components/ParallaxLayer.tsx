"use client";

import { ReactNode, useRef } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  axis?: "y" | "x";
}

export function ParallaxLayer({
  children,
  speed = 50,
  className = "",
  axis = "y",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref as any, { speed, axis });

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
