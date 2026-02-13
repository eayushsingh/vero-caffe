import Image from "next/image";
import Navbar from "@/components/navbar";

// Use local placeholders to keep the gallery deterministic during development
const IMAGES = [
  "/images/gallery1.svg",
  "/images/gallery2.svg",
  "/images/gallery3.svg",
  "/images/gallery1.svg",
  "/images/gallery2.svg",
  "/images/gallery3.svg",
];

export default function GalleryPage() {
  return (
  <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.2em] uppercase text-neutral-500">Gallery</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold">Moments From VERO</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {IMAGES.map((src, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden group">
              <div className="relative h-64 md:h-72 w-full">
                <Image src={src} alt={`gallery-${idx}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
