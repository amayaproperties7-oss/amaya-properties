"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxOptions {
  speed?: number;
  axis?: "y" | "x";
  scrub?: boolean | number;
  start?: string;
  end?: string;
  trigger?: RefObject<HTMLElement>;
}

export function useParallax(
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
) {
  const {
    speed = 100,
    axis = "y",
    scrub = true,
    start = "top bottom",
    end = "bottom top",
    trigger,
  } = options;

  useGSAP(
    () => {
      if (!ref.current) return;

      const movement = speed;

      gsap.to(ref.current, {
        [axis]: movement,
        ease: "none",
        scrollTrigger: {
          trigger: trigger?.current || ref.current,
          start,
          end,
          scrub,
        },
      });
    },
    { scope: ref, dependencies: [speed, axis, scrub, start, end] }
  );
}
