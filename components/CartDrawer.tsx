"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, selectTotalQty, selectSubtotal } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

/* ── Razorpay global type ── */
declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

export default function CartDrawer() {
    const router = useRouter();
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    /* ── Zustand store ── */
    const items = useCartStore((s) => s.items);
    const cartOpen = useCartStore((s) => s.cartOpen);
    const setCartOpen = useCartStore((s) => s.setCartOpen);
    const addItem = useCartStore((s) => s.addItem);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const removeItem = useCartStore((s) => s.removeItem);
    const clearCart = useCartStore((s) => s.clearCart);
    const totalQty = useCartStore(selectTotalQty);
    const subtotal = useCartStore(selectSubtotal);

    /* ── Handlers ── */
    const handleCheckout = async () => {
        try {
            setCheckoutLoading(true);

            // 1. Auth check
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setCartOpen(false);
                router.push("/auth");
                return;
            }

            // 2. Create Razorpay order via API
            const res = await fetch("/api/create-razorpay-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: subtotal }),
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error("Order creation failed:", errData);
                return;
            }

            const { orderId } = await res.json();

            // 3. Open Razorpay popup
            const options: Record<string, unknown> = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: subtotal * 100,
                currency: "INR",
                name: "VERO CAFFÉ",
                description: "Order Payment",
                order_id: orderId,
                handler: (response: Record<string, unknown>) => {
                    console.log("Payment success:", response);
                    clearCart();
                    setCartOpen(false);
                },
                theme: { color: "#6A4B3A" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Checkout error:", err);
        } finally {
            setCheckoutLoading(false);
        }
    };

    /* ── Framer variants ── */
    const backdrop: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const drawer: Variants = {
        hidden: { x: "100%" },
        show: {
            x: 0,
            transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
        },
        exit: {
            x: "100%",
            transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
        },
    };

    return (
        <AnimatePresence>
            {cartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="cart-backdrop"
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        variants={backdrop}
                        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
                        onClick={() => setCartOpen(false)}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="cart-drawer"
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        variants={drawer}
                        className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-md bg-white shadow-2xl flex flex-col"
                        aria-modal="true"
                        role="dialog"
                        aria-label="Shopping cart"
                    >
                        <div className="h-full flex flex-col bg-white/95 backdrop-blur-xl">
                            {/* ── Header ── */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                                <div>
                                    <h2
                                        className="font-serif text-xl tracking-wide text-[#1A1A1A] font-semibold"
                                        style={{ fontFamily: "var(--font-serif)" }}
                                    >
                                        Your Order
                                    </h2>
                                    <p className="text-xs text-neutral-400 tracking-wider uppercase mt-0.5">
                                        {totalQty} {totalQty === 1 ? "item" : "items"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {items.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="text-xs text-neutral-400 hover:text-red-500 transition-colors duration-200 tracking-wide uppercase"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        aria-label="Close cart"
                                        onClick={() => setCartOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-neutral-500" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>

                            {/* ── Item List ── */}
                            <div className="flex-1 overflow-y-auto">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                                            <ShoppingBag className="w-8 h-8 text-neutral-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-neutral-500 font-medium">
                                            Your cart is empty
                                        </p>
                                        <p className="text-neutral-400 text-sm mt-1 max-w-[200px]">
                                            Looks like you haven't added anything to your cart yet.
                                        </p>
                                        <button
                                            onClick={() => setCartOpen(false)}
                                            className="mt-6 text-[#6A4B3A] text-sm font-medium hover:underline underline-offset-4"
                                        >
                                            Start Browsing
                                        </button>
                                    </div>
                                ) : (
                                    <ul className="px-6 py-2">
                                        {items.map((entry, idx) => (
                                            <li key={entry.id}>
                                                <div className="flex gap-4 py-5">
                                                    {/* Image */}
                                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                                                        {entry.image ? (
                                                            <Image
                                                                src={entry.image}
                                                                alt={entry.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="80px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                <ShoppingBag className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div>
                                                                <h3 className="text-sm font-semibold text-[#1A1A1A] leading-tight">
                                                                    {entry.name}
                                                                </h3>
                                                                <p className="text-xs text-neutral-500 mt-1 tabular-nums">
                                                                    ₹{entry.price.toLocaleString("en-IN")}
                                                                </p>
                                                            </div>
                                                            <span className="text-sm font-semibold text-[#1A1A1A] tabular-nums">
                                                                ₹{(entry.price * entry.qty).toLocaleString("en-IN")}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-3">
                                                            {/* Stepper */}
                                                            <div className="flex items-center bg-neutral-50 rounded-full border border-neutral-200 p-0.5">
                                                                <button
                                                                    onClick={() => decreaseQty(entry.id)}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-600 hover:bg-white hover:text-[#6A4B3A] hover:shadow-sm transition-all"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-medium tabular-nums text-[#1A1A1A]">
                                                                    {entry.qty}
                                                                </span>
                                                                <button
                                                                    onClick={() => addItem({ id: entry.id, name: entry.name, price: entry.price })}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-600 hover:bg-white hover:text-[#6A4B3A] hover:shadow-sm transition-all"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            {/* Remove */}
                                                            <button
                                                                onClick={() => removeItem(entry.id)}
                                                                className="text-xs text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-md"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span className="sr-only sm:not-sr-only sm:inline-block">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {idx < items.length - 1 && (
                                                    <div className="border-b border-neutral-100" />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* ── Footer ── */}
                            {items.length > 0 && (
                                <div className="border-t border-neutral-100 px-6 py-6 bg-[#FAFAF8]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-neutral-500">Subtotal</span>
                                        <span className="text-xl font-semibold text-[#1A1A1A] tabular-nums">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-neutral-400 mb-6">
                                        Taxes and shipping calculated at checkout
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <Button
                                            onClick={handleCheckout}
                                            className="w-full h-12 rounded-full bg-[#6A4B3A] text-white text-sm font-medium tracking-widest uppercase hover:bg-[#5A3F31] transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Checkout
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCartOpen(false)}
                                            className="w-full h-12 rounded-full border border-neutral-200 text-neutral-600 text-sm font-medium tracking-widest uppercase hover:bg-neutral-50 hover:text-[#1A1A1A] transition-all duration-300"
                                        >
                                            Continue Browsing
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
const handleCheckout = async () => {
    const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
    });

    const data = await res.json();

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: subtotal * 100,
        currency: "INR",
        name: "VERO CAFFÉ",
        description: "Order Payment",
        order_id: data.orderId,

        handler: function (response: any) {
            alert("Payment Successful ✅");
            console.log(response);
        },

        theme: {
            color: "#6A4B3A",
        },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
};
