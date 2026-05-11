"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxLayer } from "./ParallaxLayer";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !titleRef.current) return;

      // Initial reveal
      gsap.from(titleRef.current.children, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Sticky title logic
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: titleRef.current,
        pinSpacing: false,
      });

      // Zoom effect on the main visual
      gsap.to(".hero-zoom", {
        scale: 1.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section 
      ref={containerRef} 
      className="relative h-[220vh] w-full bg-background overflow-hidden"
    >
      {/* Background Layer (Deep Parallax) */}
      <ParallaxLayer speed={120} className="absolute inset-0 z-0">
        <div className="relative h-screen w-full opacity-40 blur-sm">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000"
            alt="Luxury Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </ParallaxLayer>

      {/* Midground Layer (Main Image) */}
      <ParallaxLayer speed={60} className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-[80vh] w-[90%] md:w-[70%] hero-zoom overflow-hidden rounded-sm shadow-2xl border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
            alt="Main Property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
      </ParallaxLayer>

      {/* Foreground Layer (Fast Parallax) */}
      <ParallaxLayer speed={-80} className="absolute inset-0 z-30 pointer-events-none">
         <div className="absolute top-[60%] right-[10%] w-64 h-80 rounded-sm overflow-hidden shadow-2xl border border-white/20 hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000"
              alt="Luxury Architecture"
              fill
              className="object-cover"
            />
         </div>
      </ParallaxLayer>

      {/* Sticky Content */}
      <div 
        ref={titleRef} 
        className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[10vh] md:pt-[15vh] pointer-events-none w-full"
      >
        <div className="flex flex-col items-center justify-center text-center px-4 w-full">
          <h1 className="text-5xl md:text-9xl font-serif font-light mb-4 tracking-tighter text-center leading-none">
            <span className="block overflow-hidden">
              <span className="inline-block">AMAYA</span>
            </span>
            <span className="block overflow-hidden text-gold">
              <span className="inline-block">PROPERTIES</span>
            </span>
          </h1>
          <p className="text-[12px] md:text-xl tracking-[0.3em] font-light text-white/60 uppercase text-center mb-10 max-w-[80%]">
            Architectural Excellence & Timeless Design
          </p>
          <Link href="/listings" className="pointer-events-auto px-8 md:px-10 py-3 md:py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold tracking-[0.4em] hover:bg-gold hover:border-gold hover:text-black transition-all">
            EXPLORE PROPERTIES
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-gold to-transparent animate-pulse-slow" />
        <span className="text-[10px] tracking-[0.5em] uppercase">Scroll</span>
      </div>
    </section>
  );
}
