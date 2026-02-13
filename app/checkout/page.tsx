"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, MapPin, Clock, CreditCard } from "lucide-react";
import { useCartStore, selectSubtotal } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Script from "next/script";

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const subtotal = useCartStore(selectSubtotal);
    const [mounted, setMounted] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [orderType, setOrderType] = useState<"table" | "pickup">("table");
    const [tableNo, setTableNo] = useState("");
    const [pickupTime, setPickupTime] = useState("");

    const createOrder = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in");

        const { data, error } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                items: items,
                subtotal: subtotal,
                status: "pending"
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const handlePayment = async () => {
        try {
            // 1. Create Supabase Order first (to secure inventory/intent)
            const order = await createOrder();

            // 2. Create Razorpay Order via API
            const response = await fetch("/api/create-razorpay-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: order.subtotal }),
            });

            const { orderId, error } = await response.json();

            if (error) {
                console.error("Razorpay API Error:", error);
                alert("Payment initialization failed. Please try again.");
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.subtotal * 100,
                currency: "INR",
                name: "VERO CAFFÉ",
                description: "Coffee Order",
                order_id: orderId,
                handler: function (response: any) {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Here you would typically verify signature and update order status
                },
                prefill: {
                    name: name,
                    contact: phone,
                },
                theme: {
                    color: "#6A4B3A",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Error during payment flow:", error);
            alert("Something went wrong. Please check your connection.");
        }
    };

    // Prevent hydration mismatch & Check Auth
    useEffect(() => {
        setMounted(true);
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) router.push("/auth");
        };
        checkAuth();
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">Your cart is empty</h1>
                <p className="text-neutral-500 mb-8 max-w-md">
                    Looks like you haven't added anything to your cart yet. Browse our menu to find your favorites.
                </p>
                <Link href="/menu">
                    <Button className="rounded-full px-8 py-6 bg-[#6A4B3A] text-white hover:bg-[#5A3F31] text-base tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl">
                        Browse Menu
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <Link
                            href="/menu"
                            className="p-2 rounded-full hover:bg-black/5 transition-colors text-[#1A1A1A]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-serif text-3xl text-[#1A1A1A] tracking-wide">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: Customer Details */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Section: Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
                            >
                                <h2 className="font-serif text-xl text-[#1A1A1A] mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#6A4B3A] text-white flex items-center justify-center text-xs font-bold">1</span>
                                    Contact Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-neutral-600 uppercase tracking-wider">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-neutral-600 uppercase tracking-wider">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section: Order Type */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
                            >
                                <h2 className="font-serif text-xl text-[#1A1A1A] mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#6A4B3A] text-white flex items-center justify-center text-xs font-bold">2</span>
                                    Dining Preference
                                </h2>

                                <div className="flex gap-4 mb-6">
                                    <button
                                        onClick={() => setOrderType("table")}
                                        className={`flex-1 py-4 px-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${orderType === "table"
                                            ? "border-[#6A4B3A] bg-[#6A4B3A]/5 text-[#6A4B3A]"
                                            : "border-neutral-200 hover:border-neutral-300 text-neutral-500"
                                            }`}
                                    >
                                        <MapPin className={`w-6 h-6 ${orderType === "table" ? "text-[#6A4B3A]" : "text-neutral-400"}`} />
                                        <span className="font-medium">Dine-in / Table</span>
                                    </button>
                                    <button
                                        onClick={() => setOrderType("pickup")}
                                        className={`flex-1 py-4 px-6 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${orderType === "pickup"
                                            ? "border-[#6A4B3A] bg-[#6A4B3A]/5 text-[#6A4B3A]"
                                            : "border-neutral-200 hover:border-neutral-300 text-neutral-500"
                                            }`}
                                    >
                                        <ShoppingBag className={`w-6 h-6 ${orderType === "pickup" ? "text-[#6A4B3A]" : "text-neutral-400"}`} />
                                        <span className="font-medium">Curbside Pickup</span>
                                    </button>
                                </div>

                                {orderType === "table" ? (
                                    <div className="space-y-2">
                                        <label htmlFor="tableNo" className="text-sm font-medium text-neutral-600 uppercase tracking-wider">Table Number</label>
                                        <input
                                            type="text"
                                            id="tableNo"
                                            value={tableNo}
                                            onChange={(e) => setTableNo(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                            placeholder="e.g. T-12"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label htmlFor="pickupTime" className="text-sm font-medium text-neutral-600 uppercase tracking-wider">Estimated Pickup Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <input
                                                type="time"
                                                id="pickupTime"
                                                value={pickupTime}
                                                onChange={(e) => setPickupTime(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-5">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 lg:sticky lg:top-32"
                            >
                                <h2 className="font-serif text-xl text-[#1A1A1A] mb-6">Order Summary</h2>

                                <ul className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-100">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-medium text-[#1A1A1A] truncate">{item.name}</p>
                                                    <p className="font-medium text-[#1A1A1A] tabular-nums">₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                                                </div>
                                                <p className="text-sm text-neutral-500">
                                                    Qty: {item.qty} × ₹{item.price}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-dashed border-neutral-200 pt-6 space-y-3">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Subtotal</span>
                                        <span className="tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Taxes (5%)</span>
                                        <span className="tabular-nums">₹{(subtotal * 0.05).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-[#1A1A1A] font-semibold text-lg pt-4 border-t border-neutral-100">
                                        <span>Total</span>
                                        <span className="tabular-nums">₹{(subtotal * 1.05).toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-8 rounded-full py-7 bg-[#6A4B3A] text-white hover:bg-[#5A3F31] text-base tracking-widest uppercase shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                                    onClick={handlePayment}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Proceed to Payment
                                </Button>

                                <p className="text-center text-xs text-neutral-400 mt-4">
                                    Secure SSL Encryption
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
