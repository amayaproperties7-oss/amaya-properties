"use client";

import { useEffect, useState, useRef } from "react";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, Calendar, User, MapPin, Clock, CheckCircle, Scan, X, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVisits, VisitRecord } from "@/context/VisitContext";

export default function AdminEventsPage() {
  const { scheduledVisits, isLoading: visitsLoading } = useVisits();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const startScanner = async () => {
    setIsScannerOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access is required for the scanner.");
      setIsScannerOpen(false);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScannerOpen(false);
  };

  if (authLoading || visitsLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white/40 tracking-[0.5em] uppercase text-[10px]">Verifying Credentials...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <RevealSection>
            <h1 className="text-4xl font-serif tracking-widest mb-2">EVENT LOGISTICS</h1>
            <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Site Visits & VIP Management</p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <button 
              onClick={startScanner}
              className="flex items-center gap-4 px-10 py-4 bg-gold text-black text-[10px] font-bold tracking-[0.4em] hover:bg-white transition-all rounded-sm shadow-xl shadow-gold/10"
            >
              <Scan className="w-4 h-4" /> LAUNCH QR TERMINAL
            </button>
          </RevealSection>
        </div>

        {/* Visits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledVisits.map((visit, i) => (
            <RevealSection key={visit.id} delay={i * 0.05} className="bg-surface border border-white/5 p-8 rounded-sm hover:border-gold/20 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="px-4 py-1 bg-gold/10 text-gold text-[8px] font-bold tracking-widest uppercase border border-gold/20">
                  Confirmed
                </div>
                <div className="text-[10px] text-white/20 tracking-widest uppercase">
                   {visit.date}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif mb-1 group-hover:text-gold transition-colors">{visit.name.toUpperCase()}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 tracking-widest uppercase font-bold">
                    <Phone className="w-3 h-3" /> {visit.phone}
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-white/60">
                      <MapPin className="w-4 h-4 text-gold/60" />
                      <span className="text-[10px] tracking-widest uppercase font-bold">{visit.projectName || "General Visit"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/60">
                      <Clock className="w-4 h-4 text-gold/60" />
                      <span className="text-[10px] tracking-widest uppercase font-bold">{visit.time}</span>
                   </div>
                </div>

                <div className="h-[1px] bg-white/5" />

                <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] font-bold tracking-widest uppercase hover:bg-gold hover:text-black transition-all rounded-sm">
                   Check-in Guest
                </button>
              </div>
            </RevealSection>
          ))}

          {scheduledVisits.length === 0 && (
            <div className="col-span-full py-40 text-center border border-dashed border-white/10 rounded-sm">
               <p className="text-white/20 tracking-[0.5em] uppercase text-[10px]">No upcoming site visits found</p>
            </div>
          )}
        </div>
      </div>

      {/* Scanner Modal Overlay */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="absolute top-10 right-10">
            <button onClick={stopScanner} className="text-white hover:text-gold transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="w-full max-w-lg aspect-square relative border-2 border-gold/40 rounded-sm overflow-hidden bg-black shadow-[0_0_100px_rgba(212,175,55,0.1)]">
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover grayscale opacity-60" 
             />
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-64 h-64 border-2 border-gold border-dashed opacity-40 animate-pulse-slow" />
                <div className="mt-8 text-gold text-[10px] tracking-[0.5em] font-bold uppercase animate-pulse">Scanning for VIP QR...</div>
             </div>
             
             {/* Scanner Corner Decor */}
             <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold" />
             <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold" />
             <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gold" />
             <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold" />
          </div>
          
          <div className="mt-12 text-center max-w-md">
             <h2 className="text-2xl font-serif mb-4">ADMINISTRATIVE SCANNER</h2>
             <p className="text-white/40 text-[10px] tracking-[0.3em] leading-relaxed uppercase font-bold">
               Position the guest's digital check-in code within the frame to verify their reservation status.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
