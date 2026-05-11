"use client";

import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealSectionProps {
  children: ReactNode;
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  onClick?: () => void;
}

export function RevealSection({
  children,
  y = 60,
  opacity = 0,
  duration = 1,
  delay = 0,
  stagger = 0.15,
  className = "",
  onClick,
}: RevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.children;

      gsap.from(elements, {
        y,
        opacity,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div 
      ref={containerRef} 
      className={`${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
