import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthProvider } from "@/context/AuthContext";
import { PropertyProvider } from "@/context/PropertyContext";
import { VisitProvider } from "@/context/VisitContext";
import { InterestProvider } from "@/context/InterestContext";
import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "Amaya Properties | Luxury Properties",
  description: "Curated selection of exceptional properties and architectural excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-gold selection:text-background",
          sans.variable,
          serif.variable
        )}
      >
        <LenisProvider>
          <AuthProvider>
            <PropertyProvider>
              <VisitProvider>
                <InterestProvider>
                  <SavedPropertiesProvider>
                    {/* Grain Overlay */}
                    <div className="grain" />
                    
                    <Navbar />

                    <main>{children}</main>

                    {/* Footer */}
                    <footer className="py-20 px-10 border-t border-white/5 bg-surface text-center flex flex-col items-center">
                      <div className="relative w-64 h-32 mb-6">
                          <Image 
                            src="/assets/images/amaya-logo.jpg" 
                            alt="Amaya Properties Logo" 
                            fill 
                            className="object-contain"
                          />
                      </div>
                      <p className="text-white/40 text-sm max-w-md mx-auto mb-10">
                        Dedicated to the pursuit of architectural excellence and the art of fine living.
                      </p>
                      <div className="text-[10px] tracking-[0.5em] text-white/20 uppercase">
                        © 2026 Amaya Properties. All Rights Reserved.
                      </div>
                    </footer>
                  </SavedPropertiesProvider>
                </InterestProvider>
              </VisitProvider>
            </PropertyProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
