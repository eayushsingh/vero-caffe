"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// COMPONENTS
function StatusBadge({ status }: { status: string }) {
    const getStyle = (s: string) => {
        switch (s?.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "ready": return "bg-blue-100 text-blue-800 border-blue-200";
            case "completed": return "bg-green-100 text-green-800 border-green-200";
            case "cancelled": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getStyle(status)
        )}>
            {status || "unknown"}
        </span>
    );
}

function StatusSelect({
    orderId,
    currentStatus,
    onUpdate
}: {
    orderId: string,
    currentStatus: string,
    onUpdate: (id: string, status: string) => void
}) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = async (newStatus: string) => {
        setLoading(true);
        // Optimistic
        onUpdate(orderId, newStatus);

        try {
            const { error } = await supabase
                .from("orders")
                .update({ order_status: newStatus })
                .eq("id", orderId);

            if (error) {
                console.error("Failed to update status:", error);
                // Revert? (For now we rely on re-fetch or error message)
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block w-32">
            <select
                value={currentStatus}
                onChange={(e) => handleChange(e.target.value)}
                disabled={loading}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-1 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline text-sm"
            >
                <option value="pending">pending</option>
                <option value="ready">ready</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                )}
            </div>
        </div>
    );
}

import { Order } from "@/types";

export default function AdminOrdersTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          items:order_items(*)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);

        } catch (err) {
            console.error("Fetch error:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Realtime subscription could be added here
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                (payload: any) => {
                    console.log('Change received!', payload);
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleOptimisticUpdate = (id: string, newStatus: string) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    };

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button
                    onClick={fetchOrders}
                    className="p-2 hover:bg-gray-200 rounded-full transition"
                    title="Refresh"
                >
                    <RefreshCw className={cn("w-5 h-5 text-gray-500", loading && "animate-spin")} />
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.created_at ? format(new Date(order.created_at), "MMM d, h:mm a") : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.name || "Guest"}</div>
                                    <div className="text-sm text-gray-500">{order.phone || "N/A"}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {(Array.isArray(order.items) ? order.items : order.items?.cartItems || []).map((i: any) => `${i.quantity}x ${i.name}`).join(", ") || "No items"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ₹{order.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.order_status || "pending"} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusSelect
                                        orderId={order.id}
                                        currentStatus={order.order_status || "pending"}
                                        onUpdate={handleOptimisticUpdate}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
