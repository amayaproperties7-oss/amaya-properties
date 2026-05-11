"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, User, Mail, Lock, Phone } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to create user session");

      // 2. Insert into custom users table
      const { error: dbError } = await supabase.from('users').insert({
        id: userId,
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        user_type: "Member"
      });

      if (dbError) {
        // Deep log of the error object to catch non-enumerable properties
        console.error("Database Error (Detailed):", {
          ...dbError,
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
          stack: dbError.stack,
          raw: JSON.stringify(dbError, Object.getOwnPropertyNames(dbError))
        });
        
        // Check if session exists (if not, RLS will fail)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("No active session found after signup. This usually means Email Confirmation is enabled in Supabase, preventing the profile insert.");
        }
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      console.error("Signup Catch Block:", err);
      setErrorMsg(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 md:pt-32 px-6 md:px-20 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO HOMEPAGE
        </Link>

        <RevealSection className="bg-surface border border-white/5 p-6 md:p-10 rounded-sm shadow-2xl">
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl font-serif tracking-widest">BECOME A MEMBER</h1>
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Exclusive Access to Luxury Properties</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-widest uppercase font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 pl-12 pr-4 py-4 text-sm outline-none focus:border-gold transition-colors"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 pl-12 pr-4 py-4 text-sm outline-none focus:border-gold transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 pl-12 pr-4 py-4 text-sm outline-none focus:border-gold transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 pl-12 pr-4 py-4 text-sm outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gold text-black text-[10px] font-bold tracking-[0.5em] hover:bg-white transition-all rounded-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "REGISTERING..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-white/5" />
            <p className="text-[8px] tracking-[0.3em] text-white/20 uppercase font-bold">OR CONTINUE WITH</p>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <button 
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
              });
              if (error) setErrorMsg(error.message);
              setLoading(false);
            }}
            className="w-full mt-8 py-4 bg-white/5 border border-white/10 flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group"
          >
            <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-[10px] tracking-[0.3em] font-bold">GOOGLE ACCOUNT</span>
          </button>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] tracking-widest text-white/40 uppercase">
              Already a member? <Link href="/login" className="text-gold font-bold hover:text-white transition-colors">Sign In</Link>
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
