"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { Loader2, Package, ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return; // Middleware or layout should handle redirect

                const res = await fetch("/api/orders/user", {
                    headers: {
                        "Authorization": `Bearer ${session.access_token}`
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch orders");

                const data = await res.json();
                setOrders(data.orders || []);

            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-8 h-8 animate-spin text-[#6A4B3A]" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-8 h-8 text-neutral-400" />
                </div>
                <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">No past orders</h1>
                <p className="text-neutral-500 mb-8 max-w-md">
                    You haven't placed any orders yet. Start exploring our menu!
                </p>
                <Link href="/menu">
                    <Button className="rounded-full px-8 py-6 bg-[#6A4B3A] text-white hover:bg-[#5A3F31]">
                        Browse Menu
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-3xl text-[#1A1A1A] mb-8">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                            <div className="p-6 border-b border-neutral-100 flex flex-wrap gap-4 justify-between items-center bg-neutral-50/50">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Order Placed</p>
                                    <p className="text-sm font-medium text-[#1A1A1A]">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Total</p>
                                    <p className="text-sm font-medium text-[#1A1A1A]">₹{order.subtotal?.toLocaleString("en-IN")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Order ID</p>
                                    <p className="text-sm font-medium text-[#1A1A1A]">#{order.id.slice(0, 8)}</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white border border-neutral-200 shadow-sm">
                                    {order.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                                        order.status === 'CANCELLED' ? <XCircle className="w-4 h-4 text-red-500" /> :
                                            <Clock className="w-4 h-4 text-yellow-500" />}
                                    <span className={
                                        order.status === 'COMPLETED' ? 'text-green-700' :
                                            order.status === 'CANCELLED' ? 'text-red-700' :
                                                'text-yellow-700'
                                    }>{order.status}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <ul className="divide-y divide-neutral-100">
                                    {/* Handle both array of items and object wrapper structure if present */}
                                    {(Array.isArray(order.items) ? order.items : order.items?.cartItems || []).map((item: any, idx: number) => (
                                        <li key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-neutral-100">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-neutral-300">
                                                        <ShoppingBag className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium text-[#1A1A1A]">{item.name}</h3>
                                                    <p className="text-sm font-semibold text-[#1A1A1A]">₹{item.price}</p>
                                                </div>
                                                <p className="text-sm text-neutral-500 mt-1">Qty: {item.qty}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-between items-center">
                                    <span className="text-sm text-neutral-500">
                                        Payment Method: <span className="font-medium text-[#1A1A1A]">{order.payment_id === 'PAY_AT_COUNTER' ? 'Pay at Counter' : 'Online'}</span>
                                    </span>
                                    {/* Action buttons could go here (e.g., Reorder) */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
