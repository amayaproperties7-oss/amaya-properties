"use client";

import { useProperties } from "@/context/PropertyContext";
import { RevealSection } from "@/components/RevealSection";
import Image from "next/image";
import { Plus, Search, MapPin, Edit3, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminPropertiesPage() {
  const { properties, deleteProperty } = useProperties();
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const filteredProperties = properties.filter(p => 
    (p.projectName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (p.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <RevealSection>
            <h1 className="text-4xl font-serif tracking-widest mb-2">MANAGE PROPERTIES</h1>
            <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Inventory Control & Listing Management</p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <Link href="/admin/properties/add" className="flex items-center gap-4 px-10 py-4 bg-gold text-black text-[10px] font-bold tracking-[0.4em] hover:bg-white transition-all rounded-sm">
              <Plus className="w-4 h-4" /> ADD NEW PROPERTY
            </Link>
          </RevealSection>
        </div>

        {/* Search Bar */}
        <RevealSection className="relative mb-12 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR LOCATION..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-white/5 pl-16 pr-6 py-6 text-[10px] tracking-[0.2em] outline-none focus:border-gold transition-colors rounded-sm"
          />
        </RevealSection>

        {/* Property List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProperties.map((prop, i) => (
            <RevealSection key={prop.id} delay={i * 0.05} className="flex flex-col md:flex-row items-center gap-8 p-6 bg-surface border border-white/5 rounded-sm group hover:bg-white/[0.02] transition-colors">
               <div className="relative w-full md:w-48 aspect-square overflow-hidden rounded-sm bg-black/20">
                  <Image 
                    src={(prop.images[0]?.startsWith('http') || prop.images[0]?.startsWith('data:')) ? prop.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000'} 
                    alt={prop.projectName} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
               </div>
              
              <div className="flex-1 space-y-4">
                 <div>
                   <h2 className="text-2xl font-serif mb-1">{prop.projectName}</h2>
                   <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase font-bold">
                      <MapPin className="w-3 h-3 text-gold" />
                      {prop.location}
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-white/5 text-[9px] tracking-widest uppercase font-bold text-white/60">{prop.bhkType}</div>
                    <div className="px-4 py-2 bg-white/5 text-[9px] tracking-widest uppercase font-bold text-white/60">{prop.area}</div>
                    <div className="px-4 py-2 bg-gold/10 text-[9px] tracking-widest uppercase font-bold text-gold">{prop.price}</div>
                    {prop.isFeatured && (
                      <div className="px-4 py-2 bg-white text-black text-[9px] tracking-widest uppercase font-bold border border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]">FEATURED</div>
                    )}
                 </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                 <Link href={`/property/${prop.id}`} className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:border-white transition-colors rounded-sm flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                 </Link>
                 <button className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 hover:border-gold transition-colors rounded-sm flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => deleteProperty(prop.id)}
                  className="flex-1 md:flex-none p-4 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-sm flex items-center justify-center"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </RevealSection>
          ))}
          
          {filteredProperties.length === 0 && (
            <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
               <p className="text-white/20 tracking-[0.5em] uppercase text-[10px]">No properties matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
