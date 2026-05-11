"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProperties } from "@/context/PropertyContext";
import { RevealSection } from "@/components/RevealSection";
import { supabase } from "@/utils/supabase";
import { 
  User, 
  Mail, 
  Phone, 
  Clock, 
  ArrowRight, 
  Building2, 
  MessageSquare,
  ChevronRight,
  LogOut,
  MapPin,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { properties, isLoading: propsLoading } = useProperties();
  const router = useRouter();
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchInquiries = async () => {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInquiries(data || []);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [user, authLoading, router]);

  if (authLoading || (loading && !inquiries.length && !user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold tracking-[0.5em] animate-pulse uppercase font-bold text-[10px]">AUTHENTICATING...</div>
      </div>
    );
  }

  const getPropertyData = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-40 md:pt-32 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <RevealSection className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-serif tracking-tighter">
                Member <span className="text-gold italic">Profile</span>
              </h1>
              <p className="text-white/40 tracking-[0.3em] uppercase text-[10px] font-bold">
                Exclusively managed for {user?.fullName || "Valued Client"}
              </p>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all uppercase"
            >
              <LogOut className="w-3 h-3" /> Secure Logout
            </button>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-4 space-y-12">
            <RevealSection delay={0.1} className="bg-surface border border-white/5 p-8 md:p-10 rounded-sm">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <User className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-2xl font-serif mb-1">{user?.fullName || "Member"}</h2>
                <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-bold">{user?.userType || "Member"}</span>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase font-bold">Email Address</label>
                  <div className="flex items-center gap-3 text-white/80">
                    <Mail className="w-4 h-4 text-gold/40" />
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase font-bold">Phone Number</label>
                  <div className="flex items-center gap-3 text-white/80">
                    <Phone className="w-4 h-4 text-gold/40" />
                    <span className="text-sm font-medium">{user?.phone || "Not provided"}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-[8px] tracking-[0.4em] text-white/20 uppercase font-bold">Member Since</label>
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar className="w-4 h-4 text-gold/40" />
                    <span className="text-sm font-medium">October 2024</span>
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.2} className="bg-gold/5 border border-gold/10 p-8 rounded-sm">
               <h3 className="text-gold text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Membership Perks</h3>
               <ul className="space-y-3">
                 {["Early Access to Off-Market", "Dedicated Portfolio Manager", "Priority Site Visits", "Exclusive Market Insights"].map((perk, i) => (
                   <li key={i} className="flex items-center gap-3 text-[10px] text-white/60 tracking-wider">
                     <div className="w-1 h-1 bg-gold rounded-full" /> {perk}
                   </li>
                 ))}
               </ul>
            </RevealSection>
          </div>

          {/* Right Content - Inquiries */}
          <div className="lg:col-span-8 space-y-12">
            <RevealSection delay={0.3} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MessageSquare className="w-4 h-4 text-gold" />
                <h2 className="text-xl tracking-[0.2em] font-serif">Property Inquiries</h2>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold text-white/40">{inquiries.length}</span>
              </div>
              <Link href="/listings" className="text-[9px] tracking-widest text-gold hover:text-white transition-colors uppercase font-bold flex items-center gap-2 group">
                Browse More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealSection>

            {inquiries.length === 0 ? (
              <RevealSection delay={0.4} className="py-20 text-center border border-dashed border-white/10 rounded-sm">
                <Building2 className="w-12 h-12 text-white/10 mx-auto mb-6" />
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-bold">You haven't made any inquiries yet.</p>
                <Link href="/listings" className="mt-8 inline-block px-10 py-4 bg-gold text-black text-[10px] font-bold tracking-[0.4em] hover:bg-white transition-all">
                  START EXPLORING
                </Link>
              </RevealSection>
            ) : (
              <div className="space-y-6">
                {inquiries.map((inquiry, i) => {
                  const property = getPropertyData(inquiry.property_id);
                  return (
                    <RevealSection key={inquiry.id} delay={0.1 * i} className="group">
                      <div className="bg-surface border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:border-gold/30 transition-colors">
                        {/* Property Image Thumbnail */}
                        <div className="relative w-full md:w-32 h-32 md:h-32 flex-shrink-0 bg-black/40 overflow-hidden rounded-sm">
                          {property?.images?.[0] ? (
                            <Image 
                              src={property.images[0]} 
                              alt={property.projectName} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-white/10" />
                            </div>
                          )}
                        </div>

                        {/* Inquiry Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-serif mb-1">{property?.projectName || "Unknown Property"}</h3>
                              <div className="flex items-center gap-2 text-white/40 text-[9px] tracking-widest uppercase font-bold">
                                <MapPin className="w-3 h-3" /> {property?.location || "Mumbai"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`px-3 py-1 text-[8px] font-bold tracking-widest uppercase rounded-sm border ${
                                inquiry.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                                inquiry.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                'bg-white/5 border-white/10 text-white/40'
                              }`}>
                                {inquiry.status}
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/20 p-4 rounded-sm italic text-sm text-white/60 line-clamp-2">
                            "{inquiry.message}"
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4 text-[9px] tracking-widest text-white/20 uppercase font-bold">
                              <Clock className="w-3 h-3" /> {new Date(inquiry.created_at).toLocaleDateString()}
                            </div>
                            <Link 
                              href={property ? `/property/${property.id}` : '#'} 
                              className="inline-flex items-center gap-2 text-gold text-[9px] tracking-widest uppercase font-bold hover:text-white transition-colors"
                            >
                              View Property <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </RevealSection>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
