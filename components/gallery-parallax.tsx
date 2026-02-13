"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

// Use local, deterministic placeholders to avoid upstream image failures during development
const IMAGES = [
  "/images/gallery1.svg",
  "/images/gallery2.svg",
  "/images/gallery3.svg",
  "/images/gallery1.svg",
  "/images/gallery2.svg",
  "/images/gallery3.svg",
];

const floatVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function GalleryParallax() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]); // Increased parallax depth

  return (
    <section ref={ref as any} className="w-full max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {IMAGES.map((src, i) => (
          <motion.div key={i} style={{ y }} whileHover={{ scale: 1.03 }} className="rounded-2xl overflow-hidden bg-neutral-50">
            <div className="relative h-56 md:h-64 w-full">
              <Image src={src} alt={`gallery-${i}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 hover:scale-105" priority={i < 2} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
