"use client";

import { Hero3D } from "@/components/Hero3D";
import { RevealSection } from "@/components/RevealSection";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { useProperties } from "@/context/PropertyContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { properties } = useProperties();
  
  // Dynamic selection for the homepage
  const featured = properties.some(p => p.isFeatured) 
    ? properties.filter(p => p.isFeatured).slice(0, 3)
    : (properties.length > 0 ? properties.slice(0, Math.min(3, properties.length)) : []);
    
  const collections = properties.length > 3 ? properties.slice(3, Math.min(7, properties.length)) : properties;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero */}
      <Hero3D />


      {/* 3. Curated Selection */}
      <section className="py-20 md:py-40 px-6 md:px-20 bg-background">
        <RevealSection className="text-center mb-12 md:mb-20 space-y-4">
           <h2 className="text-[10px] tracking-[0.6em] text-white/40 uppercase">Curated Selection</h2>
           <h3 className="text-3xl md:text-5xl font-serif">Exceptional Offerings</h3>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.map((prop, i) => (
            <Link key={prop.id} href={`/property/${prop.id}`} className="group">
              <RevealSection delay={i * 0.2}>
                <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-sm bg-surface">
                  <Image 
                    src={prop.images[0]} 
                    alt={prop.projectName} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-gold text-black text-[10px] font-bold tracking-widest">
                    {prop.price}
                  </div>
                </div>
                <h4 className="text-2xl font-serif mb-2">{prop.projectName}</h4>
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{prop.location}</p>
              </RevealSection>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Full Width Reveal Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
         <Image 
           src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000" 
           alt="Panoramic" 
           fill 
           className="object-cover opacity-30"
         />
         <RevealSection className="relative z-10 text-center space-y-8 md:space-y-10 px-6">
            <h3 className="text-3xl md:text-7xl font-serif max-w-4xl leading-tight">
              A legacy of trust in every <br className="hidden md:block"/> <span className="text-gold italic">unforgettable</span> view.
            </h3>
            <Link href="/listings">
              <button className="px-8 md:px-10 py-3 md:py-4 bg-white text-black text-[10px] md:text-[12px] font-bold tracking-[0.4em] hover:bg-gold transition-colors">
                EXPLORE PROPERTIES
              </button>
            </Link>
         </RevealSection>
      </section>

      {/* 5. Browse by Collection */}
      <section className="py-20 md:py-40 px-6 md:px-20 bg-surface">
        <RevealSection className="mb-12 md:mb-20">
           <h2 className="text-[10px] tracking-[0.6em] text-white/40 uppercase mb-4">The Portfolio</h2>
           <h3 className="text-3xl md:text-4xl font-serif">Browse by Collection</h3>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {collections.map((prop, i) => (
            <Link key={prop.id} href={`/property/${prop.id}`} className="block group">
              <RevealSection delay={i * 0.1} className="relative aspect-[16/9] overflow-hidden rounded-sm">
                 <Image 
                   src={prop.images[0]} 
                   alt={prop.projectName} 
                   fill 
                   className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                 <div className="absolute bottom-10 left-10 space-y-2">
                    <h4 className="text-3xl font-serif">{prop.projectName}</h4>
                    <p className="text-[10px] tracking-[0.3em] text-white/60 uppercase">{prop.bhkType} • {prop.location}</p>
                 </div>
              </RevealSection>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Newsletter / CTA */}
      <section className="py-20 md:py-40 px-6 text-center bg-background">
         <RevealSection className="max-w-2xl mx-auto space-y-8 md:space-y-10">
            <h3 className="text-3xl md:text-4xl font-serif italic text-gold">Stay Informed</h3>
            <p className="text-white/40 leading-relaxed text-sm md:text-base">
              Join our exclusive circle for early access to off-market listings and the latest in luxury property design.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="EMAIL ADDRESS" 
                 className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-[10px] tracking-[0.2em] outline-none focus:border-gold transition-colors"
               />
               <button className="bg-white text-black px-10 py-4 text-[10px] font-bold tracking-[0.3em] hover:bg-gold transition-colors">
                 SUBSCRIBE
               </button>
            </div>
         </RevealSection>
      </section>
    </div>
  );
}
