"use client";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Minus, Plus, Trash2, User } from "lucide-react";
import {
  useCartStore,
  selectTotalQty,
  selectSubtotal,
} from "@/store/useCartStore";
import CartDrawer from "./CartDrawer";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  /* ── Zustand store ── */
  const items = useCartStore((s) => s.items);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalQty = useCartStore(selectTotalQty);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartStore((state) => state.hydrated);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  if (!hydrated) return null;

  /* ── Framer variants ── */
  const navVariant: Variants = {
    hidden: { opacity: 0, y: -24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const panel: Variants = {
    hidden: { x: "100%" },
    show: {
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
    },
  };



  const backdrop: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={navVariant}
      className="sticky top-0 z-50 transition-all duration-300"
      role="banner"
    >
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-5 bg-white/70 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center"
              aria-label="VERO CAFFE Home"
            >
              <span className="sr-only">VERO CAFFÉ</span>
              <Logo size="nav" />
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="flex-1 flex justify-center">
            <nav
              className="hidden md:flex gap-8 text-sm tracking-wide"
              aria-label="Primary Navigation"
            >
              <Link
                href="/"
                className="text-[#3A3A3A] hover:text-[#6A4B3A] transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/menu"
                className="text-[#3A3A3A] hover:text-[#6A4B3A] transition-colors duration-200"
              >
                Menu
              </Link>
              <Link
                href="/about"
                className="text-[#3A3A3A] hover:text-[#6A4B3A] transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/gallery"
                className="text-[#3A3A3A] hover:text-[#6A4B3A] transition-colors duration-200"
              >
                Gallery
              </Link>
            </nav>
          </div>

          {/* Right: CTAs + Cart + Mobile */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/menu" aria-label="Our Menu">
                <Button className="rounded-full px-5 py-1.5 border border-[#6A4B3A] text-[#6A4B3A] bg-transparent hover:bg-[#6A4B3A] hover:text-white transition-all duration-300">
                  Our Menu
                </Button>
              </Link>
              <Link href="/contact" aria-label="Visit VERO CAFFE">
                <Button
                  className="rounded-full px-5 py-1.5 bg-[#6A4B3A] text-white hover:bg-[#5A3F31] transition-all duration-300"
                  style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.08)" }}
                >
                  Visit Us
                </Button>
              </Link>
            </div>

            {/* User Profile (Desktop) */}
            <div className="hidden md:block">
              <ProfileMenu />
            </div>

            {/* Cart icon — always visible */}
            <button
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#6A4B3A]/10 transition-colors duration-200"
            >
              <ShoppingBag
                className="w-[18px] h-[18px] text-[#6A4B3A]"
                strokeWidth={1.8}
              />
              <AnimatePresence>
                {totalQty > 0 && (
                  <motion.span
                    key={totalQty}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                    }}
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] bg-[#6A4B3A] text-white text-[10px] font-semibold rounded-full leading-none tabular-nums"
                  >
                    {totalQty}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile hamburger */}
            <div className="flex items-center md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#3A3A3A] hover:bg-black/5"
              >
                <span className="sr-only">Open menu</span>
                <div className="flex flex-col gap-1.5">
                  <span className="block w-5 h-[2px] bg-current rounded" />
                  <span className="block w-5 h-[2px] bg-current rounded" />
                  <span className="block w-5 h-[2px] bg-current rounded" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Mobile Navigation Drawer ═══════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial="hidden"
            animate="show"
            exit="exit"
            variants={panel}
            className="fixed inset-0 z-50"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-black/10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-md h-full shadow-xl">
              <div className="px-6 py-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3"
                    aria-label="VERO CAFFÉ Home"
                  >
                    <Logo size="nav" />
                  </Link>
                  <button
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-md hover:bg-black/5"
                  >
                    <span className="sr-only">Close menu</span>
                    <div className="relative w-5 h-5">
                      <span className="absolute left-0 top-1/2 w-full h-[2px] bg-[#3A3A3A] rotate-45" />
                      <span className="absolute left-0 top-1/2 w-full h-[2px] bg-[#3A3A3A] -rotate-45" />
                    </div>
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-6">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#1A1A1A]"
                  >
                    Home
                  </Link>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#1A1A1A]"
                  >
                    Menu
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#1A1A1A]"
                  >
                    About
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#1A1A1A]"
                  >
                    Gallery
                  </Link>

                  <div className="pt-4 border-t border-black/[0.06] flex flex-col gap-3">
                    <Link href="/menu" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-full px-4 py-2 border border-[#6A4B3A] text-[#6A4B3A] bg-transparent hover:bg-[#6A4B3A] hover:text-white transition-all duration-300">
                        Our Menu
                      </Button>
                    </Link>
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-full px-4 py-2 bg-[#6A4B3A] text-white hover:bg-[#5A3F31]">
                        Visit Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════════ Right‑Side Cart Drawer ═══════════════════ */}
      {/* ═══════════════════ Right‑Side Cart Drawer ═══════════════════ */}
      <CartDrawer />
    </motion.header>
  );
}
