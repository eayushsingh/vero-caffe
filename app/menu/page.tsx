import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import MenuSection from "@/components/MenuSection"

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-4">
          <p className="tracking-[0.2em] text-sm uppercase text-neutral-500">MENU</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-semibold text-[#111827]">VERO CAFFE</h1>
          <p className="mt-3 text-neutral-500">Crafted Coffee &amp; Signature Plates</p>
        </div>
      </div>

      <MenuSection />

      <div className="pb-20 text-center">
        <Link href="/" className="text-sm tracking-[0.25em] uppercase text-[#6B6B6B] hover:text-[#1A1A1A] transition">Back To Home</Link>
      </div>
    </main>
  )
}
