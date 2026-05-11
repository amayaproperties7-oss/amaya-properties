"use client";

import { RevealSection } from "@/components/RevealSection";
import { useProperties } from "@/context/PropertyContext";
import { LayoutDashboard, Home, Users, MessageSquare, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useVisits } from "@/context/VisitContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function AdminPage() {
  const { properties } = useProperties();
  const { allUsers, user, isLoading } = useAuth();
  const { scheduledVisits } = useVisits();
  const router = useRouter();
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";

  useEffect(() => {
    if (!isLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!supabase) return;
        
        const { data, count } = await supabase
          .from('inquiries')
          .select('*, properties(project_name)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5);

        if (data) {
          setRecentInquiries(data);
          setInquiriesCount(count || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "LISTED PROPERTIES", value: properties.length, icon: Home, color: "bg-gold" },
    { title: "ACTIVE MEMBERS", value: allUsers.length, icon: Users, color: "bg-white/10" },
    { title: "TOTAL INQUIRIES", value: inquiriesCount, icon: MessageSquare, color: "bg-gold/80" },
    { title: "SITE VISITS", value: scheduledVisits.length, icon: Calendar, color: "bg-white/20" },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <RevealSection className="mb-12">
        <h1 className="text-4xl font-serif tracking-widest mb-2">ADMIN TERMINAL</h1>
        <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Estate Management & Client Inquiries</p>
      </RevealSection>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, i) => (
          <div key={stat.title} className="bg-surface border border-white/5 p-10 rounded-sm hover:border-gold/20 transition-all group flex flex-col items-start gap-8">
            <RevealSection delay={i * 0.1} y={20}>
              <div className={`w-14 h-14 ${stat.color} flex items-center justify-center rounded-sm group-hover:scale-110 transition-transform shadow-xl shadow-black/40`}>
                <stat.icon className="w-7 h-7 text-black" />
              </div>
            </RevealSection>
            <RevealSection delay={i * 0.1 + 0.1} y={10}>
              <div className="space-y-3">
                <div className="text-5xl font-bold tracking-tighter text-white leading-none">{stat.value}</div>
                <div className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold">{stat.title}</div>
              </div>
            </RevealSection>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2">
          <RevealSection className="mb-8 flex justify-between items-center">
            <h2 className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-bold">RECENT INQUIRIES</h2>
            <Link href="/admin/inquiries" className="text-gold text-[10px] tracking-widest uppercase hover:text-white transition-colors">View All</Link>
          </RevealSection>
          
          <div className="space-y-4">
             {recentInquiries.length === 0 ? (
               <div className="p-10 border border-dashed border-white/10 text-center">
                 <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">No inquiries yet.</p>
               </div>
             ) : (
               recentInquiries.map((inquiry, i) => (
                 <RevealSection key={inquiry.id} delay={i * 0.05} className="flex items-center justify-between p-6 bg-surface border border-white/5 rounded-sm hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-gold/10 flex justify-center items-center rounded-full border border-gold/20 shadow-lg">
                         <MessageSquare className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <div className="text-xl font-serif group-hover:text-gold transition-colors">{inquiry.properties?.project_name || "Unknown Property"}</div>
                        <div className="flex items-center gap-2 mt-1">
                           <Users className="w-3 h-3 text-gold/60" />
                           <span className="text-[10px] tracking-widest text-white/40 uppercase font-bold">By: {inquiry.user_email}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 text-[9px] tracking-widest uppercase font-bold border ${inquiry.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                      {inquiry.status}
                    </div>
                 </RevealSection>
               ))
             )}
          </div>
        </div>

        {/* Estate Operations */}
        <div className="space-y-8">
          <div>
            <h2 className="text-[10px] tracking-[0.5em] text-white/40 uppercase font-bold mb-8">ESTATE OPERATIONS</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: "ADD NEW ESTATE", icon: Home, href: "/admin/properties/add", primary: true },
                { label: "MANAGE INVENTORIES", icon: Home, href: "/admin/properties", primary: false },
                { label: "MANAGE INQUIRIES", icon: MessageSquare, href: "/admin/inquiries", primary: false },
                { label: "SITE VISITS & EVENTS", icon: Calendar, href: "/admin/events", primary: false },
                { label: "REGISTERED CUSTOMERS", icon: Users, href: "/admin/users", primary: false }
              ].map((action, i) => (
                <Link 
                  key={i}
                  href={action.href} 
                  className={`w-full flex items-center justify-between p-6 transition-all group rounded-sm ${
                    action.primary 
                    ? "bg-gold text-black hover:bg-white" 
                    : "bg-surface border border-white/5 text-white/60 hover:border-gold/40 hover:text-white"
                  }`}
                >
                   <div className="flex items-center gap-4">
                     <action.icon className="w-4 h-4" />
                     <span className="text-[10px] tracking-[0.3em] font-bold">{action.label}</span>
                   </div>
                   <ChevronRight className={`w-4 h-4 transition-transform ${action.primary ? "group-hover:translate-x-2" : "text-white/20 group-hover:text-gold group-hover:translate-x-2"}`} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
