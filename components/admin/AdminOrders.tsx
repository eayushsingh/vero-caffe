"use client";

import { useEffect, useState } from "react";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { Loader2, Package, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch("/api/admin/orders", {
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Realtime subscription (Optional enhancement, usually safe if RLS allows Select)
        // If strict API-only read is required, we might skip this, but it improves UX significantly.
        // Given RLS enables Select for Admins, this is secure.
        const subscription = supabase
            .channel('admin-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        const originalOrders = [...orders];
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Unauthorized");
                setOrders(originalOrders);
                return;
            }

            const res = await fetch("/api/admin/orders/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    orderId,
                    status: newStatus
                })
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }

        } catch (error) {
            console.error("Status update failed:", error);
            setOrders(originalOrders); // Revert on failure
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6A4B3A]" /></div>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-bold mb-6 text-[#1A1A1A]">Orders Management</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                            // Extract customer details from items JSON metadata if available (fallback to dummy)
                            // Note: If schema has top-level fields (user_name etc), we should try to use them first.
                            // But my API creates them in 'items'. I will check both for robustness.
                            const customerName = order.user_name || order.items?.customerDetails?.name || order.user_id.slice(0, 8);
                            const customerEmail = order.user_email || order.items?.customerDetails?.email || "N/A";

                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-medium text-gray-900">{customerName}</div>
                                        <div className="text-xs text-gray-400">{customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        ₹{order.subtotal?.toLocaleString("en-IN") || order.total?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`block w-full px-3 py-1.5 text-xs text-white rounded-full border-0 focus:ring-2 focus:ring-[#6A4B3A] shadow-sm sm:text-sm font-medium
                                                ${order.status === 'PENDING' ? 'bg-yellow-500' :
                                                    order.status === 'PREPARING' ? 'bg-blue-500' :
                                                        order.status === 'READY' ? 'bg-indigo-500' :
                                                            order.status === 'COMPLETED' ? 'bg-green-500' :
                                                                'bg-red-500'
                                                }`}
                                        >
                                            <option value="PENDING" className="bg-white text-black">Pending</option>
                                            <option value="PREPARING" className="bg-white text-black">Preparing</option>
                                            <option value="READY" className="bg-white text-black">Ready</option>
                                            <option value="COMPLETED" className="bg-white text-black">Completed</option>
                                            <option value="CANCELLED" className="bg-white text-black">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                        <p className="mt-1 text-sm text-gray-500">New orders will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
