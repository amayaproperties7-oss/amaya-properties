"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "amayaproperties7@gmail.com", // Pre-filled for admin convenience
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const ADMIN_EMAIL = "amayaproperties7@gmail.com";
    const ADMIN_PASSWORD = "AmayaAdmin@2026";

    try {
      // Direct check for master credentials
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        // Attempt Supabase login to establish real session for RLS
        const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (loginError) throw loginError;

        if (session) {
          // Give the AuthContext a moment to pick up the new session
          setTimeout(() => {
            router.push("/admin");
            router.refresh();
          }, 500);
          return;
        }
      } else {
        throw new Error("UNAUTHORIZED: This terminal is restricted to the Master Admin.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 md:px-20 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> EXIT TO PUBLIC SITE
        </Link>

        <RevealSection className="bg-surface border border-gold/20 p-10 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.05)]">
          <div className="flex justify-center mb-6">
             <div className="p-4 bg-gold/10 rounded-full">
                <ShieldCheck className="w-8 h-8 text-gold" />
             </div>
          </div>
          
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl font-serif tracking-widest uppercase">ADMIN TERMINAL</h1>
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Authorized Access Only</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-widest uppercase font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Administrator ID</label>
              <input 
                readOnly
                type="email"
                value={formData.email}
                className="w-full bg-black/40 border border-white/5 pl-4 pr-4 py-4 text-sm text-white/40 outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Master Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  required
                  autoFocus
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/20 border border-gold/20 pl-12 pr-4 py-4 text-sm outline-none focus:border-gold transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gold text-black text-[10px] font-bold tracking-[0.5em] hover:bg-white transition-all rounded-sm mt-8 shadow-xl shadow-gold/5"
            >
              {loading ? "VERIFYING..." : "ENTER TERMINAL"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-[8px] tracking-[0.3em] text-white/20 uppercase">
              Encrypted Management Layer v2.0
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
