"use client";

import { useAuth } from "@/context/AuthContext";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, User, Mail, Calendar, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const { allUsers, user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const filteredUsers = allUsers.filter(user => 
    (user.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <RevealSection>
            <h1 className="text-4xl font-serif tracking-widest mb-2">REGISTERED CUSTOMERS</h1>
            <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Client Relations & Member Management</p>
          </RevealSection>
        </div>

        {/* Search Bar */}
        <RevealSection className="relative mb-12 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR EMAIL..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-white/5 pl-16 pr-6 py-6 text-[10px] tracking-[0.2em] outline-none focus:border-gold transition-colors rounded-sm"
          />
        </RevealSection>

        {/* Users Table / List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user, i) => (
            <RevealSection key={user.id} delay={i * 0.05} className="flex flex-col md:flex-row items-center gap-8 p-8 bg-surface border border-white/5 rounded-sm hover:bg-white/[0.02] transition-all group">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 shadow-xl shadow-black/40">
                <User className="w-8 h-8 text-gold" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif">{user.fullName || "Anonymous Member"}</h2>
                  <div className="px-3 py-1 bg-white/5 text-[8px] tracking-widest uppercase font-bold text-white/40 border border-white/10 rounded-full">
                    {user.userType || "Member"}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase">
                    <Mail className="w-3 h-3 text-gold/60" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[10px] tracking-widest uppercase">
                    <Calendar className="w-3 h-3 text-gold/60" />
                    Joined: {new Date(parseInt(user.id) || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                 <button className="flex-1 md:flex-none px-8 py-3 bg-white/5 border border-white/10 text-[9px] tracking-widest font-bold uppercase hover:bg-gold hover:text-black transition-all rounded-sm">
                   View Profile
                 </button>
                 <button className="flex-1 md:flex-none p-3 bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-black transition-all rounded-sm">
                   <ShieldCheck className="w-4 h-4" />
                 </button>
              </div>
            </RevealSection>
          ))}

          {filteredUsers.length === 0 && (
            <div className="py-40 text-center border border-dashed border-white/10 rounded-sm">
               <p className="text-white/20 tracking-[0.5em] uppercase text-[10px]">No registered members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
