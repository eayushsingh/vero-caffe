"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, CreditCard, Banknote, Loader2 } from "lucide-react"
import { useCartStore, selectSubtotal } from "@/store/useCartStore"
import Navbar from "@/components/navbar"

export default function CheckoutPage() {
    const router = useRouter()
    const items = useCartStore((s) => s.items)
    const subtotal = useCartStore(selectSubtotal)
    const clearCart = useCartStore((s) => s.clearCart)
    const hydrated = useCartStore((s) => s.hydrated)

    useEffect(() => {
        useCartStore.persist.rehydrate()
    }, [])

    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"online" | "counter" | null>(null)

    // Form State
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [note, setNote] = useState("")

    // Hydration check
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const handlePlaceOrder = async (method: "online" | "counter") => {
        if (!name.trim()) {
            alert("Please enter your name")
            return
        }
        if (!phone.trim() || phone.length < 10) {
            alert("Please enter a valid phone number")
            return
        }

        setPaymentMethod(method)
        setLoading(true)

        try {
            // 1. Create Order in DB (and Razorpay if online)
            const orderRes = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    payment_method: method.toUpperCase(),
                    user_name: name,
                    phone: phone,
                    notes: note || null,
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

            if (method === "online") {
                // 2. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: "INR",
                    order_id: orderData.razorpay_order_id,
                    name: "VERO CAFFÉ",
                    description: "Coffee Order",
                    handler: async function (response: any) {
                        try {
                            setLoading(true);
                            // 3. Verify Payment
                            const verifyRes = await fetch("/api/payment/verify", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: orderData.order_id
                                }),
                            });

                            if (!verifyRes.ok) throw new Error("Payment verification failed");

                            clearCart();
                            router.push(`/success?method=${method}&order_id=${orderData.order_id}`);
                        } catch (err: any) {
                            alert(err.message || "Payment verification failed. Please contact support.");
                        } finally {
                            setLoading(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                            setPaymentMethod(null);
                        }
                    },
                    theme: { color: "#6A4B3A" }
                };

                const razor = new (window as any).Razorpay(options);
                razor.open();
            } else {
                // 3. Counter Payment success
                clearCart()
                router.push(`/success?method=${method}&order_id=${orderData.order_id}`)
            }

        } catch (err: any) {
            console.error("Order error:", err)
            alert(err.message || "Failed to place order. Please try again.")
            setLoading(false)
            setPaymentMethod(null)
        }
    }

    if (!hydrated) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#6A4B3A]" />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">Your cart is empty</h1>
                    <p className="text-neutral-500 mb-8 max-w-md">
                        Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                    <Link
                        href="/menu"
                        className="rounded-full px-8 py-4 bg-[#6A4B3A] text-white hover:bg-[#5A3F31] text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        )
    }

    const fallbackImage = "/coffee.jpg"

    return (
        <div className="min-h-screen bg-[#FAFAF8]">
            <Navbar />

            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Contact Details */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                            <h2 className="font-serif text-xl text-[#1A1A1A] mb-6 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-[#6A4B3A] text-white flex items-center justify-center text-xs font-bold">1</span>
                                Contact Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all"
                                        placeholder="Mobile Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="note" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20 focus:border-[#6A4B3A] transition-all resize-none"
                                        placeholder="Any special requests or allergies..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
                            <h2 className="font-serif text-xl text-[#1A1A1A] mb-6 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-[#6A4B3A] text-white flex items-center justify-center text-xs font-bold">2</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Pay Online Button */}
                                <button
                                    onClick={() => handlePlaceOrder("online")}
                                    disabled={loading}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-[#6A4B3A] bg-[#6A4B3A] text-white hover:bg-[#5A3F31] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading && paymentMethod === "online" ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        <CreditCard className="w-8 h-8" />
                                    )}
                                    <span className="font-semibold">Pay Online</span>
                                    <span className="text-xs text-white/70">UPI, Card, Net Banking</span>
                                </button>

                                {/* Pay at Counter Button */}
                                <button
                                    onClick={() => handlePlaceOrder("counter")}
                                    disabled={loading}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-[#6A4B3A] bg-white text-[#6A4B3A] hover:bg-[#6A4B3A]/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading && paymentMethod === "counter" ? (
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    ) : (
                                        <Banknote className="w-8 h-8" />
                                    )}
                                    <span className="font-semibold">Pay at Counter</span>
                                    <span className="text-xs text-neutral-500">Cash or Card at Pickup</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-200 sticky top-8">
                            <h2 className="font-serif text-xl text-[#1A1A1A] mb-6">Order Summary</h2>

                            <ul className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <li key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-100">
                                            <Image
                                                src={item.image || fallbackImage}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-medium text-[#1A1A1A] truncate">{item.name}</p>
                                                <p className="font-medium text-[#1A1A1A] tabular-nums">
                                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                            <p className="text-sm text-neutral-500">
                                                Qty: {item.quantity} × ₹{item.price}
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
                                <div className="flex justify-between text-[#1A1A1A] font-semibold text-lg pt-4 border-t border-neutral-100">
                                    <span>Total</span>
                                    <span className="tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
