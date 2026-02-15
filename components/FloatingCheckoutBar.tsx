"use client"

import { useEffect, useState } from "react"
import { useCartStore, selectTotalQty, selectSubtotal } from "@/store/useCartStore"
import { ShoppingBag, ChevronRight } from "lucide-react"

export default function FloatingCheckoutBar() {
    const totalQuantity = useCartStore(selectTotalQty)
    const subtotal = useCartStore(selectSubtotal)
    const setCartOpen = useCartStore((s) => s.setCartOpen)
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) return null;

    // Hide when cart is empty
    if (totalQuantity === 0) return null

    const handleOpenCart = () => {
        setCartOpen(true)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe animate-in slide-in-from-bottom duration-300">
            <div
                className="max-w-lg mx-auto bg-[#6A4B3A] text-white rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    boxShadow: "0 -4px 30px rgba(0,0,0,0.2)"
                }}
            >
                <button
                    onClick={handleOpenCart}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#5A3F31] transition-colors duration-200"
                >
                    {/* Left side - Items count and total */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingBag className="w-6 h-6 text-white/90" />
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[#6A4B3A] text-[10px] font-bold rounded-full flex items-center justify-center">
                                {totalQuantity}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/80">
                                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} added
                            </span>
                            <span className="text-white/40">•</span>
                            <span className="text-lg font-bold tabular-nums">
                                ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Right side - Continue button */}
                    <div className="flex items-center gap-2 bg-white text-[#6A4B3A] font-semibold px-4 py-2 rounded-xl">
                        <span className="text-sm">Continue to Cart</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </div>
    )
}
