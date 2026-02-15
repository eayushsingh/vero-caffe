import Navbar from "@/components/navbar";
import HeroCinematic from "@/components/hero-cinematic";
import GalleryParallax from "@/components/gallery-parallax";
import MapSection from "@/components/MapSection";
import BrandVideo from "@/components/BrandVideo";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/footer";

export default async function Home() {
  return (
    <div className="min-h-screen antialiased">
      <Navbar />

      <main className="w-full">
        <HeroCinematic />

        <BrandVideo />

        <MenuSection />

        <GalleryParallax />
        <MapSection />
        <Footer />
      </main>
    </div>
  );
}
