"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RevealSection } from "@/components/RevealSection";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { supabase } from "@/utils/supabase";

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Registration successful! Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO HOMEPAGE
        </Link>

        <RevealSection className="bg-surface border border-white/5 p-10 rounded-sm shadow-2xl">
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl font-serif tracking-widest">SIGN IN</h1>
            <p className="text-[10px] tracking-[0.4em] text-gold uppercase font-bold">Welcome Back to Amaya</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-widest uppercase font-bold text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] tracking-widest uppercase font-bold text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
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
              Not a member yet? <Link href="/signup" className="text-gold font-bold hover:text-white transition-colors">Apply Now</Link>
            </p>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold tracking-widest text-[10px]">LOADING AUTHENTICATION...</div>}>
      <LoginContent />
    </Suspense>
  );
}
