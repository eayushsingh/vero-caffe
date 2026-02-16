
"use client"

import Link from 'next/link'
import Navbar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { createClient } from "@/lib/supabase/client"

interface Order {
    id: string
    total: number
    order_status: string
    created_at: string
    order_items: {
        id: string
        name: string
        quantity: number
        price: number
    }[]
}

export default function OrdersPage() {
    const supabase = createClient()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [guestId, setGuestId] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Retrieve guest ID if available
        const storedGuestId = typeof window !== 'undefined' ? localStorage.getItem("guest_id") : null
        setGuestId(storedGuestId)

        const fetchOrders = async () => {
            try {
                // Determine fetch strategy: Supabase direct or API
                // Using API for initial fetch to be consistent with previous logic, 
                // OR use Supabase directly if we want to bypass cache completely for realtime base.
                // The prompt Step 2 code uses `supabase.from("orders")...`. 
                // However, without RLS policy for "guest_id", pure Supabase select might fail for guests if not using `user_id`.
                // If using `user_id`, we need the auth user.

                // Let's stick to the previous API fetch pattern for initial load to ensure guest support works,
                // BUT the prompt requested: "Fetch orders from Supabase using user_id" in the example code.
                // If I use the API, I ensure RLS doesn't block guests.
                // To support REALTIME, I must use supabase client.

                // HYBRID APPROACH:
                // 1. Fetch initial data via API (secure for guests).
                // 2. Subscribe to realtime events.

                let url = "/api/orders/user"
                if (storedGuestId) {
                    url += `?guest_id=${storedGuestId}`
                }

                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setOrders(data.orders || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()

        // Realtime Subscription
        // Note: Realtime listens to TABLE changes.
        // We filter by logic.
        // Since Postgres Changes filter by column value is easiest:
        // .on(..., filter: `user_id=eq.${userId}`, ...)
        // But for guests we might rely on guest_id or just listen to all and filter locally?
        // Listening to ALL orders is insecure/heavy.
        // However, standard RLS doesn't filter Realtime streams unless "Realtime RLS" is enabled (which is newer/advanced).
        // For this task, we will implementation the prompt's suggested simple subscription:
        // It subscribes to the whole table and refetches. Refetch calls the API which is secure.

        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders'
                },
                (payload) => {
                    console.log('Realtime update received:', payload)
                    // We simply refetch to get the latest consistent data (including items)
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [])

    const getStatusColor = (s: string) => {
        const status = s ? s.toLowerCase() : "pending"
        switch (status) {
            case "pending": return "bg-gray-100 text-gray-800"
            case "preparing": return "bg-yellow-100 text-yellow-800"
            case "ready": return "bg-blue-100 text-blue-800"
            case "completed": return "bg-green-100 text-green-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8]">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#FAFAF8]">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-serif">Your Orders</h1>
                    <button onClick={() => window.location.reload()} className="text-sm text-neutral-500 hover:text-black underline">Refresh Status</button>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No orders found.</p>
                        <Link href="/menu" className="text-[#6A4B3A] underline">
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-6">
                                <div className="flex justify-between items-start mb-4 border-b pb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(order.created_at), 'PPP p')}
                                        </p>
                                        <p className="font-medium mt-1">
                                            Order #{order.id.slice(0, 8)}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <p className="font-bold text-lg">₹{order.total}</p>
                                        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full mt-2 ${getStatusColor(order.order_status)}`}>
                                            {order.order_status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
