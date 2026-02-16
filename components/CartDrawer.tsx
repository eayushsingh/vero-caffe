"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getItemImage } from "@/lib/categoryImages";

export default function CartDrawer() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const isOpen = useCartStore((s) => s.cartOpen);
    const closeCart = () => useCartStore.getState().setCartOpen(false);

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated || !isOpen) return null;

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="fixed inset-0 z-[100] isolate">
            {/* BACKDROP */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* CART DRAWER CONTAINER */}
            <div className="fixed inset-y-0 right-0 z-[100] flex h-full w-[420px] flex-col bg-white shadow-2xl pointer-events-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 -mr-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
                    >
                        <span className="sr-only">Close cart</span>
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* ITEMS SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-500">
                            <p>Your cart is empty</p>
                            <button onClick={closeCart} className="text-[#6B4F3A] font-medium hover:underline">
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <img
                                    src={getItemImage(item)}
                                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                    alt={item.name}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "/coffee.jpg";
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.name}</p>
                                    <p className="text-gray-500 text-sm">₹{item.price}</p>
                                    <p className="text-gray-400 text-xs mt-1">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* FOOTER - FIXED AT BOTTOM */}
                <div className="p-6 border-t mt-auto shrink-0 bg-white">
                    <div className="flex justify-between mb-4 font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>

                    <button
                        onClick={() => {
                            if (items.length === 0) return;
                            closeCart();
                            // Use router.push for SPA navigation, fallback handled by Next.js
                            router.push("/checkout");
                        }}
                        disabled={items.length === 0}
                        className="w-full h-14 bg-[#6B4F3A] text-white text-lg font-bold rounded-xl hover:bg-[#5a3f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg active:scale-[0.98] transform duration-100"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
