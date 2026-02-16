
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, CreditCard, Banknote, Loader2 } from "lucide-react"
import { useCartStore, selectSubtotal } from "@/store/useCartStore"
import { useAuth } from "@/components/hooks/useAuth"
import { getItemImage } from "@/lib/categoryImages"
import Navbar from "@/components/navbar"

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const items = useCartStore((s) => s.items)
    const subtotal = useCartStore(selectSubtotal)
    const clearCart = useCartStore((s) => s.clearCart)

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [note, setNote] = useState("")
    const [showOnlineModal, setShowOnlineModal] = useState(false)

    // Ensure hydration
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => { setHydrated(true) }, [])

    // Generate a guest ID if needed (persisted in local storage ideally, but generating simple one here)
    // Actually, backend will fallback to phone if not provided.
    // Let's generate a simple session ID for guest if we want strict guest tracking.
    const [guestId, setGuestId] = useState("")
    useEffect(() => {
        let stored = localStorage.getItem("guest_id")
        if (!stored) {
            stored = Math.random().toString(36).substring(7)
            localStorage.setItem("guest_id", stored)
        }
        setGuestId(stored)
    }, [])

    const handleCheckout = async () => {
        if (!name.trim() || !phone.trim()) {
            alert("Name and Phone are required")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    email: user?.email || null,
                    items,
                    total: subtotal,
                    payment_method: "cod",
                    notes: note,
                    guest_id: user ? null : guestId // Send guest ID
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Failed")

            clearCart()
            window.location.href = `/success?orderId=${data.orderId}`

        } catch (err: any) {
            alert(err.message)
            setLoading(false)
        }
    }

    if (!hydrated) return null

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-2xl font-serif">Your cart is empty</h1>
                    <Link href="/menu" className="mt-4 px-6 py-3 bg-[#6A4B3A] text-white rounded-full">
                        Browse Menu
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8]">
            <Navbar />
            <div className="max-w-6xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-serif mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Contact</h2>
                            <input
                                placeholder="Name *"
                                className="w-full p-3 border rounded-lg mb-3"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <input
                                placeholder="Phone *"
                                className="w-full p-3 border rounded-lg mb-3"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            <textarea
                                placeholder="Notes (Optional)"
                                className="w-full p-3 border rounded-lg"
                                rows={3}
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Payment</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowOnlineModal(true)} className="p-4 border-2 border-[#6A4B3A] bg-[#6A4B3A] text-white rounded-xl">
                                    Pay Online
                                </button>
                                <button onClick={handleCheckout} disabled={loading} className="p-4 border-2 border-[#6A4B3A] text-[#6A4B3A] rounded-xl font-bold hover:bg-[#6A4B3A] hover:text-white transition">
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Pay at Counter"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between py-2 border-b">
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="flex justify-between mt-4 text-xl font-bold">
                            <span>Total</span>
                            <span>₹{subtotal}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showOnlineModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl max-w-sm text-center">
                        <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                        <p className="text-gray-500 mb-6">Online payments are currently disabled. Please pay at the counter.</p>
                        <button onClick={() => setShowOnlineModal(false)} className="w-full py-3 bg-gray-200 rounded-lg">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}
