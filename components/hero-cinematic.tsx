"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroCinematic() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-8k.svg"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.92), rgba(243,239,234,1))",
          }}
        />
      </div>

      {/* Main layout: center content only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-18 lg:py-24">
        <div className="flex items-center justify-center">
          {/* Center content */}
          <div
            className="w-full max-w-2xl bg-white/70 backdrop-blur-xl border border-black/[0.06] rounded-2xl flex flex-col items-center text-center px-5 sm:px-8 md:px-12 py-10 sm:py-12 md:py-14 lg:py-16 relative"
            style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.045)" }}
          >

            <motion.p
              variants={fadeUp}
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#6B6B6B] font-medium mb-4 sm:mb-6"
            >
              Crafted Coffee Experience
            </motion.p>

            <motion.div variants={fadeUp} className="mb-4 sm:mb-6">
              <Logo size="hero" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              VERO CAFFÉ
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 sm:mt-6 text-[#6B6B6B] max-w-md text-sm sm:text-base leading-relaxed"
            >
              A refined neighborhood coffee house dedicated to single-origin
              beans, precise extraction, and seasonal small plates.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            >
              <Button
                asChild
                className="rounded-full px-6 sm:px-8 py-3 bg-[#6A4B3A] text-white hover:bg-[#5A3F31] transition-all duration-300 hover:scale-[1.02]"
                style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.08)" }}
              >
                <a href="/menu" className="tracking-widest font-medium text-sm">
                  Our Menu
                </a>
              </Button>
              <Button
                asChild
                className="rounded-full px-6 sm:px-8 py-3 border border-[#6A4B3A] text-[#6A4B3A] bg-transparent hover:bg-[#6A4B3A] hover:text-white transition-all duration-300 hover:scale-[1.02]"
              >
                <a
                  href="/contact"
                  className="tracking-widest font-medium text-sm"
                >
                  Visit Us
                </a>
              </Button>
              <a
                href="/about"
                className="text-sm text-[#6B6B6B] underline-offset-4 hover:text-[#1A1A1A] transition-colors duration-300"
              >
                Our Story
              </a>
            </motion.div>

            {/* Floating images container */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block z-0">

              {/* LEFT IMAGE */}
              <div className="absolute left-[-160px] top-1/2 -translate-y-1/2">
                <img
                  src="/images/categories/vero_caffe_high_quality_1.jpg"
                  alt=""
                  className="w-[150px] h-[200px] object-cover rounded-2xl shadow-xl animate-floatSlow"
                />
              </div>

              {/* RIGHT STACK CONTAINER */}
              <div className="absolute right-[-160px] top-1/2 -translate-y-1/2 flex flex-col gap-6">

                <img
                  src="/images/categories/vero_caffe_high_quality_2.jpg"
                  alt=""
                  className="w-[150px] h-[200px] object-cover rounded-2xl shadow-xl animate-floatSlow"
                />

                <img
                  src="/images/categories/vero_caffe_high_quality_3.jpg"
                  alt=""
                  className="w-[150px] h-[200px] object-cover rounded-2xl shadow-xl animate-floatSlow"
                />

              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
