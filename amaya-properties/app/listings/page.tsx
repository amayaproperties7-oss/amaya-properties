"use client";

import { useState, useMemo } from "react";
import { RevealSection } from "@/components/RevealSection";
import { useProperties } from "@/context/PropertyContext";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ArrowLeft, X, MapPin } from "lucide-react";
import { ALL_REGIONS, MUMBAI_LOCATIONS } from "@/constants/locations";

export default function ListingsPage() {
  const { properties } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedPlace, setSelectedPlace] = useState("ALL");

  // Regions from the master list
  const regions = ["ALL", ...ALL_REGIONS];

  // Places for the currently selected region
  const subPlaces = useMemo(() => {
    if (selectedRegion === "ALL") return [];
    return ["ALL", ...MUMBAI_LOCATIONS[selectedRegion as keyof typeof MUMBAI_LOCATIONS]];
  }, [selectedRegion]);

  // Filter properties based on search, region, and sub-place
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = 
        prop.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.region && prop.region.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesRegion = selectedRegion === "ALL" || prop.region === selectedRegion;
      const matchesPlace = selectedPlace === "ALL" || prop.location === selectedPlace;
      
      return matchesSearch && matchesRegion && matchesPlace;
    });
  }, [properties, searchQuery, selectedRegion, selectedPlace]);

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-40 px-6 md:px-20 bg-background min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
        <ArrowLeft className="w-3 h-3" /> BACK TO HOMEPAGE
      </Link>
      
      <RevealSection className="mb-12 md:mb-16 space-y-6">
        <h1 className="text-4xl md:text-8xl font-serif font-light tracking-tighter">
          The <span className="text-gold italic">Collections</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-10">
          <p className="text-white/40 max-w-xl text-base md:text-lg">
            Explore our meticulously curated inventory of the finest properties, penthouses, and architectural gems in Mumbai.
          </p>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex-1 md:w-80 relative">
                <input 
                  type="text" 
                  placeholder="SEARCH PROPERTIES..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 pl-12 pr-12 py-4 text-[10px] tracking-[0.2em] outline-none focus:border-gold transition-colors text-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gold transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                )}
             </div>
          </div>
        </div>
      </RevealSection>

      {/* Region Filter Bar */}
      <RevealSection delay={0.2} className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-3 h-3 text-gold" />
          <h2 className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold text-left">BROWSE BY REGION</h2>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          <div className="flex gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setSelectedPlace("ALL"); // Reset place when region changes
                }}
                className={`px-6 py-3 text-[9px] tracking-[0.3em] font-bold transition-all whitespace-nowrap border ${
                  selectedRegion === region 
                  ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                  : "bg-white/5 text-white/40 border-white/10 hover:border-white/40"
                }`}
              >
                {region.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Sub-place Filter Bar (only if region selected) */}
      {selectedRegion !== "ALL" && (
        <RevealSection delay={0.1} className="mb-16 -mt-8">
          <div className="flex items-center gap-4 mb-6 pl-4">
            <MapPin className="w-3 h-3 text-gold/60" />
            <h2 className="text-[9px] tracking-[0.4em] text-white/30 uppercase font-bold text-left">SPECIFIC LOCATIONS</h2>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            <div className="flex gap-2">
              {subPlaces.map((place) => (
                <button
                  key={place}
                  onClick={() => setSelectedPlace(place)}
                  className={`px-5 py-2 text-[8px] tracking-[0.3em] font-bold transition-all whitespace-nowrap border ${
                    selectedPlace === place 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 text-white/30 border-white/5 hover:border-white/20"
                  }`}
                >
                  {place.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {filteredProperties.length === 0 ? (
        <RevealSection className="py-20 text-center">
          <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase">No properties found matching your criteria.</p>
          <button 
            onClick={() => {setSearchQuery(""); setSelectedRegion("ALL");}}
            className="mt-6 text-gold text-[10px] tracking-widest hover:text-white transition-colors uppercase font-bold underline"
          >
            Clear all filters
          </button>
        </RevealSection>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {filteredProperties.map((prop, i) => (
            <Link key={prop.id} href={`/property/${prop.id}`} className="group">
              <RevealSection delay={i % 3 * 0.1}>
                <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-sm bg-surface">
                  <Image 
                    src={prop.images[0]} 
                    alt={prop.projectName} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                    {prop.listingType}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black to-transparent">
                     <button className="w-full py-4 bg-gold text-black text-[10px] font-bold tracking-widest">VIEW DETAILS</button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                   <div>
                     <h4 className="text-2xl font-serif mb-2">{prop.projectName}</h4>
                     <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{prop.location}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-gold font-bold text-lg">{prop.price}</p>
                      <p className="text-[9px] text-white/20 uppercase tracking-widest">{prop.bhkType}</p>
                   </div>
                </div>
              </RevealSection>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
