import Image from "next/image";
import Navbar from "@/components/navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.2em] uppercase text-neutral-500">Our Story</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[#111827]">Crafted With Passion</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md shadow-sm">
            <Image src="/images/gallery2.svg" alt="Barista" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          </div>

          <div className="text-[#1A1A1A] leading-relaxed space-y-6">
            <p className="text-lg">At VERO CAFFE we care deeply about the craft of coffee. We source seasonal beans, roast thoughtfully, and prepare each cup with precision.</p>
            <p>Our space is designed to be calm and considered — a place for conversation, work, and quiet moments. We believe in simple, honest hospitality.</p>
            <p className="text-sm text-neutral-600">Open daily for breakfast and lunch. Visit us to taste the difference.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
