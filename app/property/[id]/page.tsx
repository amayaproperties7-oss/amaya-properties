"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RevealSection } from "@/components/RevealSection";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { useProperties } from "@/context/PropertyContext";
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  MapPin, 
  Bed, 
  Maximize2, 
  Building2, 
  Hammer, 
  Phone, 
  Mail,
  CheckCircle2,
  Car,
  Dumbbell,
  Droplets,
  ShieldCheck,
  Leaf,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { properties, isLoading } = useProperties();
  const [property, setProperty] = useState<any>(null);

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const { user } = useAuth();
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");

  useEffect(() => {
    if (isLoading) return;
    const found = properties.find((p) => p.id === resolvedParams.id);
    setProperty(found);
    
    if (user) {
      setInquiryName(user.fullName || "");
      setInquiryEmail(user.email || "");
      setInquiryPhone(user.phone || "");
    }
  }, [resolvedParams.id, properties, isLoading, user]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus("submitting");
    
    try {
      const { supabase } = await import('@/utils/supabase');
      if (!supabase) throw new Error("Supabase not configured");

      const { error } = await supabase.from('inquiries').insert({
        property_id: property.id,
        user_email: inquiryEmail,
        user_name: inquiryName,
        user_phone: inquiryPhone,
        message: inquiryMessage,
        status: 'pending'
      });

      if (error) throw error;
      setInquiryStatus("success");
      setTimeout(() => setShowInquiryForm(false), 3000);
    } catch (err: any) {
      console.error("Inquiry Submission Error:", err.message || err);
      setInquiryStatus("error");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-white/40">Loading Property...</div>;
  if (!isLoading && !property) return <div className="min-h-screen bg-background flex items-center justify-center text-white/40">Property not found</div>;

  const amenityIcons: any = {
    parking: Car,
    gym: Dumbbell,
    swimming: Droplets,
    pool: Droplets,
    security: ShieldCheck,
    garden: Leaf,
    park: Leaf,
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center rounded-full pointer-events-auto hover:bg-gold hover:text-black transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-4 pointer-events-auto">
          <button className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center rounded-full hover:text-gold transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* 2. Hero Visual with Parallax */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <ParallaxLayer speed={60} className="absolute inset-0">
          <Image 
            src={property.images[0]} 
            alt={property.projectName} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </ParallaxLayer>
        
        <div className="absolute bottom-20 left-10 md:left-20 max-w-4xl">
          <RevealSection className="space-y-6">
            <div className="flex gap-4">
              <span className="px-4 py-1 bg-gold text-black text-[10px] font-bold tracking-widest uppercase">Premium Property</span>
              <span className="px-4 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase">{property.listingType}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif leading-none tracking-tighter">{property.projectName}</h1>
            <div className="flex items-center gap-4 text-white/60 text-lg">
              <MapPin className="w-5 h-5 text-gold" />
              {property.location}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 3. Main Info Section */}
      <section className="px-6 md:px-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-20">
            {/* Quick Stats */}
            <RevealSection className="grid grid-cols-2 md:grid-cols-4 gap-10 bg-surface border border-white/5 p-10 rounded-sm">
              <div className="space-y-2">
                <Bed className="w-5 h-5 text-gold" />
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold">BHK Type</div>
                <div className="text-xl font-bold">{property.bhkType}</div>
              </div>
              <div className="space-y-2">
                <Maximize2 className="w-5 h-5 text-gold" />
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Area</div>
                <div className="text-xl font-bold">{property.area}</div>
              </div>
              <div className="space-y-2">
                <Building2 className="w-5 h-5 text-gold" />
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Status</div>
                <div className="text-xl font-bold">{property.projectStatus}</div>
              </div>
              <div className="space-y-2">
                <Hammer className="w-5 h-5 text-gold" />
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold">Developer</div>
                <div className="text-xl font-bold">{property.developerName || "N/A"}</div>
              </div>
            </RevealSection>

            {/* Description */}
            <RevealSection className="space-y-8">
              <h2 className="text-3xl font-serif italic text-gold">The Vision</h2>
              <p className="text-xl text-white/60 leading-relaxed max-w-3xl font-light">
                {property.description}
              </p>
            </RevealSection>

            {/* Amenities */}
            <RevealSection className="space-y-10">
              <h2 className="text-[10px] tracking-[0.5em] text-white/40 font-bold uppercase">Exceptional Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {property.amenities?.map((amenity: string, idx: number) => {
                  const Icon = Object.entries(amenityIcons).find(([key]) => amenity.toLowerCase().includes(key))?.[1] as any || CheckCircle2;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-gold/40 transition-colors group">
                      <Icon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                      <span className="text-sm tracking-widest font-bold text-white/80">{amenity.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            </RevealSection>
          </div>

          {/* Sticky Inquiry Card */}
          <aside className="relative">
            <RevealSection className="sticky top-32 space-y-8 bg-surface border border-white/10 p-10 rounded-sm shadow-2xl">
              <div className="space-y-2">
                <div className="text-[10px] tracking-[0.3em] text-white/40 font-bold uppercase">Starting Price</div>
                <div className="text-4xl font-bold text-gold">{property.price}</div>
              </div>

              <div className="h-[1px] bg-white/10" />

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-full">
                    <Hammer className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest text-white/40 font-bold uppercase">Listing Agent</div>
                    <div className="text-lg font-bold">{property.agentName || "AMAYA Consultant"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {!showInquiryForm ? (
                     <button 
                       onClick={() => setShowInquiryForm(true)}
                       className="w-full flex items-center justify-center gap-4 py-5 bg-gold text-black text-[10px] font-bold tracking-[0.5em] hover:bg-white transition-all rounded-sm shadow-xl shadow-gold/10"
                     >
                        <MessageSquare className="w-4 h-4" /> INQUIRE NOW
                     </button>
                   ) : (
                     <form onSubmit={handleInquirySubmit} className="space-y-4 animate-fade-in-up">
                        <input 
                          required
                          type="text"
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            required
                            type="email"
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                          />
                          <input 
                            required
                            type="tel"
                            value={inquiryPhone}
                            onChange={(e) => setInquiryPhone(e.target.value)}
                            placeholder="Phone"
                            className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                          />
                        </div>
                        <textarea 
                          required
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Tell us about your interest..."
                          className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors resize-none h-24"
                        />
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setShowInquiryForm(false)}
                            className="flex-1 py-4 bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.3em] hover:bg-white/10 transition-colors"
                          >
                            CANCEL
                          </button>
                          <button 
                            type="submit"
                            disabled={inquiryStatus === "submitting"}
                            className="flex-1 py-4 bg-gold text-black text-[10px] font-bold tracking-[0.3em] hover:bg-white transition-colors disabled:opacity-50"
                          >
                            {inquiryStatus === "submitting" ? "SENDING..." : inquiryStatus === "success" ? "SENT!" : "SEND INQUIRY"}
                          </button>
                        </div>
                        {inquiryStatus === "error" && (
                          <p className="text-red-400 text-[10px] tracking-widest text-center mt-2">Failed to send.</p>
                        )}
                     </form>
                   )}
                </div>
              </div>

              <div className="pt-4 text-center">
                 <p className="text-[9px] text-white/20 tracking-widest uppercase italic">Referencing Property ID: {property.id}</p>
              </div>
            </RevealSection>
          </aside>
        </div>
      </section>
    </div>
  );
}
