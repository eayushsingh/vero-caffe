"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
    const router = useRouter();

    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const addItem = useCartStore((s) => s.addItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const cartOpen = useCartStore((s) => s.cartOpen);
    const setCartOpen = useCartStore((s) => s.setCartOpen);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    const handleCheckout = () => {
        if (items.length === 0) return;
        setCartOpen(false);
        router.push("/checkout");
    };

    if (!hydrated) return null;
    if (!cartOpen) return null;

    const Subtotal = items.reduce((acc, it) => acc + it.price * (it.quantity || 0), 0);

    // Default fallback image
    const fallbackImage = "/coffee.jpg";

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col pointer-events-auto">
                <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-bold">Your Cart</h2>
                    <button onClick={() => setCartOpen(false)} aria-label="Close cart">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        items.map(item => {
                            // Always use a valid image - fallback to category/default
                            const displayImage = item.image || fallbackImage;

                            return (
                                <div key={item.id} className="flex gap-4 border-b pb-4">
                                    <div className="relative w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={displayImage}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                (e.target as HTMLImageElement).src = fallbackImage;
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-medium truncate">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 text-xs hover:underline shrink-0"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">₹{item.price} each</p>

                                        {/* Quantity Stepper */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="inline-flex items-center rounded-full bg-neutral-100 overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="flex items-center justify-center w-8 h-8 hover:bg-neutral-200 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3.5 h-3.5 text-neutral-600" />
                                                </button>
                                                <span className="flex items-center justify-center min-w-[28px] h-8 text-sm font-semibold tabular-nums">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 })}
                                                    className="flex items-center justify-center w-8 h-8 hover:bg-neutral-200 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3.5 h-3.5 text-neutral-600" />
                                                </button>
                                            </div>
                                            <p className="font-semibold text-[#6A4B3A]">₹{item.quantity * item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-10">
                        <div className="flex justify-between mb-4 font-bold text-lg">
                            <span>Total</span>
                            <span>₹{Subtotal}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#6A4B3A] text-white py-3.5 rounded-xl font-bold hover:bg-[#5A3F31] transition-colors shadow-lg"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
