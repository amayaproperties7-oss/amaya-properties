"use client";

import { useEffect, useState } from "react";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, Mail, Home, Clock, CheckCircle, Phone, User } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          *,
          properties (
            project_name,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id: string) => {
    try {
      if (!supabase) return;
      await supabase.from('inquiries').update({ status: 'resolved' }).eq('id', id);
      fetchInquiries(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
        </Link>

        <div className="mb-12">
          <RevealSection>
            <h1 className="text-4xl font-serif tracking-widest mb-2">CUSTOMER INQUIRIES</h1>
            <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Manage Lead Communications</p>
          </RevealSection>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/40 text-[10px] tracking-[0.5em] uppercase">Loading inquiries...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {inquiries.map((inquiry, i) => (
              <RevealSection key={inquiry.id} delay={i * 0.05} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 bg-surface border border-white/5 rounded-sm group">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                      <Mail className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <User className="w-3 h-3 text-gold" />
                        {inquiry.user_name || "Anonymous Member"}
                      </h3>
                      <div className="flex gap-4 mt-1">
                        <p className="text-[10px] text-white/60 tracking-widest flex items-center gap-1">
                          <Mail className="w-2 h-2" /> {inquiry.user_email}
                        </p>
                        {inquiry.user_phone && (
                          <p className="text-[10px] text-white/60 tracking-widest flex items-center gap-1">
                            <Phone className="w-2 h-2" /> {inquiry.user_phone}
                          </p>
                        )}
                      </div>
                      <p className="text-[9px] text-white/40 tracking-widest uppercase mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(inquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-4 border border-white/5 rounded-sm">
                    <p className="text-white/80 font-light italic">"{inquiry.message}"</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/60">
                    <Home className="w-3 h-3 text-gold" />
                    Property: <span className="text-white font-bold">{inquiry.properties?.project_name || inquiry.property_id}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 w-full md:w-auto border-t border-white/5 md:border-t-0 pt-6 md:pt-0">
                  <div className={`px-4 py-1 text-[8px] font-bold tracking-widest uppercase rounded-sm border ${
                    inquiry.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {inquiry.status}
                  </div>
                  
                  {inquiry.status !== 'resolved' && (
                    <button 
                      onClick={() => markResolved(inquiry.id)}
                      className="w-full md:w-auto px-6 py-3 bg-white/5 border border-white/10 text-[9px] tracking-widest font-bold uppercase hover:bg-gold hover:text-black transition-all rounded-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>
              </RevealSection>
            ))}

            {inquiries.length === 0 && (
              <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
                 <p className="text-white/20 tracking-[0.5em] uppercase text-[10px]">No pending inquiries found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
