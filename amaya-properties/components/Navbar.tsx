"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const ADMIN_EMAIL = "amayaproperties7@gmail.com";
  const isAccessingAdmin = pathname?.startsWith("/admin");
  const isActualAdmin = user?.email === ADMIN_EMAIL;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-4 md:px-8 md:py-6 flex justify-between items-center bg-gradient-to-b from-background/80 to-transparent backdrop-blur-[2px]">
        <div className="flex-1 flex gap-10 items-center justify-start">
          {!isAccessingAdmin && (
            <>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-white hover:text-gold transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:block">
                <Link href="/listings" className="text-[10px] tracking-[0.3em] font-bold hover:text-gold transition-colors">PROPERTIES</Link>
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0 flex justify-center">
          <Link href="/" className="relative w-32 h-12 md:w-40 md:h-16">
            <Image 
              src="/assets/images/amaya-logo.jpg" 
              alt="Amaya Properties Logo" 
              fill 
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex-1 flex gap-4 md:gap-6 items-center justify-end">
          {isAccessingAdmin && (
            <div className="text-[10px] tracking-[0.5em] text-gold font-bold uppercase hidden md:block">ADMINISTRATIVE TERMINAL</div>
          )}
          
          {user && (isAccessingAdmin || !isActualAdmin) && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/profile" className="text-[10px] tracking-[0.3em] font-bold text-gold flex items-center gap-2 hover:text-white transition-colors">
                <User className="w-3 h-3" /> {isAccessingAdmin ? (user.fullName || "AMAYA ADMIN") : (user.fullName || "MEMBER")}
              </Link>
              <button onClick={signOut} className="text-[10px] tracking-[0.3em] font-bold hover:text-red-400 transition-colors">LOGOUT</button>
            </div>
          )}
          
          {/* Show Login links if guest OR if admin is browsing public pages */}
          {(!user || (isActualAdmin && !isAccessingAdmin)) && (
            <div className="hidden lg:flex gap-6">
              <Link href="/login" className="text-[10px] tracking-[0.3em] font-bold hover:text-gold transition-colors">LOGIN</Link>
              <Link href="/signup" className="text-[10px] tracking-[0.3em] font-bold hover:text-gold transition-colors">SIGN UP</Link>
            </div>
          )}

          {!isAccessingAdmin && (
            <>
              <div className="h-8 md:h-10 w-[1px] bg-white/20 mx-1 md:mx-2" />
              <Link href="/listings" className="px-4 md:px-6 py-2 border border-white/20 text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all">
                INQUIRE
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[200] bg-background/95 backdrop-blur-md transition-all duration-500 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute top-8 right-8">
          <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-gold transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center space-y-12">
          <Link 
            href="/listings" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-serif tracking-widest hover:text-gold transition-colors"
          >
            PROPERTIES
          </Link>
          
          {(!user || (isActualAdmin && !isAccessingAdmin)) ? (
            <>
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg tracking-[0.5em] font-bold hover:text-gold transition-colors"
              >
                LOGIN
              </Link>
              <Link 
                href="/signup" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg tracking-[0.5em] font-bold hover:text-gold transition-colors"
              >
                SIGN UP
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/profile" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gold tracking-[0.3em] font-bold text-center hover:text-white transition-colors"
              >
                WELCOME,<br/>{isAccessingAdmin ? "AMAYA ADMIN" : (user.fullName?.toUpperCase() || "MEMBER")}
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="text-lg tracking-[0.5em] font-bold hover:text-red-400 transition-colors"
              >
                LOGOUT
              </button>
            </>
          )}

          <div className="w-12 h-[1px] bg-white/20" />
          
          <Link 
            href="/listings" 
            onClick={() => setIsMenuOpen(false)}
            className="px-10 py-4 border border-gold text-gold text-[12px] font-bold tracking-[0.5em] hover:bg-gold hover:text-black transition-all"
          >
            INQUIRE NOW
          </Link>
        </div>
      </div>
    </>
  );
}
