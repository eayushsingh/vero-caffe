import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full bg-[#EFE9E1] border-t border-black/[0.06] py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="inline-block mb-6">
                        <Logo size="nav" />
                    </Link>
                    <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6 font-light">
                        Crafting exceptional coffee moments with single-origin beans and seasonal plates.
                    </p>
                    <div className="text-[#6B6B6B] text-xs font-light">
                        © {new Date().getFullYear()} Vero Caffé. All rights reserved.
                    </div>
                </div>

                {/* Navigation */}
                <div className="col-span-1">
                    <h4 className="text-[#1A1A1A] font-serif tracking-widest text-sm mb-6 uppercase">Explore</h4>
                    <ul className="space-y-3">
                        <li><Link href="/menu" className="text-[#6B6B6B] hover:text-[#6A4B3A] transition-colors text-sm font-light">Menu</Link></li>
                        <li><Link href="/about" className="text-[#6B6B6B] hover:text-[#6A4B3A] transition-colors text-sm font-light">Our Story</Link></li>
                        <li><Link href="/gallery" className="text-[#6B6B6B] hover:text-[#6A4B3A] transition-colors text-sm font-light">Gallery</Link></li>
                        <li><Link href="/contact" className="text-[#6B6B6B] hover:text-[#6A4B3A] transition-colors text-sm font-light">Visit Us</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="col-span-1">
                    <h4 className="text-[#1A1A1A] font-serif tracking-widest text-sm mb-6 uppercase">Visit</h4>
                    <ul className="space-y-3 text-[#6B6B6B] text-sm font-light">
                        <li>Plot No.36, Himayat Sagar Rd</li>
                        <li>Himayatnagar, Hyderabad 500075</li>
                        <li className="pt-2"><a href="tel:+919701750099" className="hover:text-[#6A4B3A] transition-colors">+91 97017 50099</a></li>
                    </ul>
                </div>

                {/* Hours */}
                <div className="col-span-1">
                    <h4 className="text-[#1A1A1A] font-serif tracking-widest text-sm mb-6 uppercase">Open Hours</h4>
                    <ul className="space-y-3 text-[#6B6B6B] text-sm font-light">
                        <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-[#1A1A1A]">7am - 7pm</span></li>
                        <li className="flex justify-between"><span>Saturday</span> <span className="text-[#1A1A1A]">8am - 8pm</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-[#1A1A1A]">8am - 6pm</span></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
