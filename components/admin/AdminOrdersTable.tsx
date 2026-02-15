"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, RefreshCw, ChevronDown, CheckCircle, XCircle, Clock, Truck } from "lucide-react";

interface Order {
    id: string;
    created_at: string;
    user_email: string;
    user_name: string;
    phone: string;
    total: number;
    status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
    payment_method: string;
    items: any[];
    order_type: string;
}

export default function AdminOrdersTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Auto-refresh every 30s
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdating(orderId);
        try {
            const res = await fetch("/api/admin/orders/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            if (res.ok) {
                // Optimistic update
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
                );
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "preparing": return "bg-orange-100 text-orange-700 border-orange-200";
            case "ready": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Orders</h2>
                <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RefreshCw className="w-5 h-5 text-neutral-500" />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Customer</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Items</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Total</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Type</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-neutral-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#1A1A1A]">{order.user_name}</div>
                                        <div className="text-xs text-neutral-500">{order.user_email}</div>
                                        <div className="text-xs text-neutral-400">{order.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="space-y-1">
                                            {order.items?.map((item: any, i: number) => (
                                                <div key={i} className="text-neutral-600 truncate">
                                                    {item.qty}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ₹{order.total.toLocaleString("en-IN")}
                                        <div className="text-xs font-normal text-neutral-400 uppercase">{order.payment_method}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.order_type === "table" ? "bg-purple-100 text-purple-700" : "bg-indigo-100 text-indigo-700"
                                            }`}>
                                            {order.order_type === "table" ? "Dine-in" : "Pickup"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                disabled={updating === order.id}
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-50 cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-400">
                                        {format(new Date(order.created_at), "MMM d, h:mm a")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
