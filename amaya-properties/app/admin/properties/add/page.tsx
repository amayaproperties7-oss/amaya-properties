"use client";

import { useProperties } from "@/context/PropertyContext";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AddPropertyPage() {
  const { addProperty } = useProperties();
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: "",
    region: "Mumbai",
    location: "",
    price: "",
    priceNumeric: 0,
    listingType: "Sale",
    bhkType: "3 BHK",
    area: "",
    projectStatus: "Ready to Move",
    developerName: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    isFeatured: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProperty = {
      ...formData,
      id: Date.now().toString(),
      images: [formData.imageUrl],
      priceNumeric: parseInt(formData.price.replace(/[^0-9]/g, "")) || 0,
      isFeatured: formData.isFeatured
    };
    addProperty(newProperty);
    router.push("/admin/properties");
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-white/40 hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> BACK TO INVENTORY
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-serif tracking-widest mb-2">LIST NEW PROPERTY</h1>
          <p className="text-[10px] tracking-[0.5em] text-gold uppercase font-bold">Define Architectural Excellence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Info */}
          <div className="bg-surface border border-white/5 p-10 rounded-sm space-y-8">
            <h2 className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold border-b border-white/5 pb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Project Name</label>
                 <input 
                   required
                   value={formData.projectName}
                   onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                   className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                   placeholder="e.g. DLF Camellias"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Location / Area</label>
                 <input 
                   required
                   value={formData.location}
                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                   className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                   placeholder="e.g. Sector 42, Gurgaon"
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-2">
                 <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Price Label</label>
                 <input 
                   required
                   value={formData.price}
                   onChange={(e) => setFormData({...formData, price: e.target.value})}
                   className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                   placeholder="e.g. ₹ 12.5 Cr"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">BHK Type</label>
                 <select 
                   value={formData.bhkType}
                   onChange={(e) => setFormData({...formData, bhkType: e.target.value})}
                   className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors text-white/60"
                 >
                   <option>2 BHK</option>
                   <option>3 BHK</option>
                   <option>4 BHK</option>
                   <option>Penthouse</option>
                   <option>Villa</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Area (Sq.Ft)</label>
                 <input 
                   required
                   value={formData.area}
                   onChange={(e) => setFormData({...formData, area: e.target.value})}
                   className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                   placeholder="e.g. 3,500 Sq.Ft"
                 />
               </div>
            </div>
          </div>

          {/* Featured Option */}
          <div className="bg-surface border border-white/5 p-10 rounded-sm space-y-4">
            <h2 className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold border-b border-white/5 pb-4">Display Options</h2>
            <div className="flex items-center gap-4">
              <input 
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                className="w-5 h-5 accent-gold bg-black/20 border border-white/10"
              />
              <label htmlFor="isFeatured" className="text-[10px] tracking-widest text-white/60 uppercase font-bold cursor-pointer">
                Feature this property on the homepage
              </label>
            </div>
          </div>

          {/* Details & Media */}
          <div className="bg-surface border border-white/5 p-10 rounded-sm space-y-8">
            <h2 className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold border-b border-white/5 pb-4">Architectural Details</h2>
            
            <div className="space-y-2">
               <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Developer Name</label>
               <input 
                 value={formData.developerName}
                 onChange={(e) => setFormData({...formData, developerName: e.target.value})}
                 className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors"
                 placeholder="e.g. DLF Luxury Homes"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Property Description</label>
               <textarea 
                 rows={5}
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 className="w-full bg-black/20 border border-white/10 p-4 text-sm outline-none focus:border-gold transition-colors resize-none"
                 placeholder="Describe the architectural soul of the property..."
               />
            </div>

            <div className="space-y-4">
               <label className="text-[9px] tracking-widest text-white/40 uppercase font-bold">Property Portrait (JPEG/PNG)</label>
               <div className="relative group">
                  <div className={`w-full aspect-video border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 rounded-sm overflow-hidden ${
                    formData.imageUrl.startsWith("http") 
                    ? "border-white/5 bg-black/20" 
                    : "border-gold/30 bg-gold/5"
                  }`}>
                     {formData.imageUrl && !formData.imageUrl.startsWith("http") ? (
                       <div className="relative w-full h-full">
                         <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => setFormData({...formData, imageUrl: ""})}
                              className="px-6 py-2 bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase"
                            >
                              Remove Image
                            </button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <ImageIcon className="w-10 h-10 text-white/10 group-hover:text-gold/40 transition-colors" />
                         <div className="text-center">
                           <p className="text-[10px] tracking-widest text-white/40 uppercase font-bold mb-2">Click to select or drag and drop</p>
                           <p className="text-[8px] tracking-widest text-white/20 uppercase">PNG, JPG up to 10MB</p>
                         </div>
                         <input 
                           type="file" 
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setFormData({...formData, imageUrl: reader.result as string});
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                           className="absolute inset-0 opacity-0 cursor-pointer"
                         />
                       </>
                     )}
                  </div>
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-6">
             <button 
               type="submit"
               className="flex-1 flex items-center justify-center gap-4 py-6 bg-gold text-black text-[10px] font-bold tracking-[0.5em] hover:bg-white transition-all rounded-sm shadow-xl shadow-gold/10"
             >
                <Save className="w-4 h-4" /> PUBLISH LISTING
             </button>
             <button 
               type="button"
               onClick={() => router.back()}
               className="px-12 py-6 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-[0.5em] hover:bg-white/10 transition-all rounded-sm"
             >
                CANCEL
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
