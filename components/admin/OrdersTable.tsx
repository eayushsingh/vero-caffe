"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    Loader2,
    RefreshCw,
    ChevronDown,
    Eye,
    CheckCircle,
    Clock,
    PlayCircle,
    Archive
} from "lucide-react";

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

interface OrdersTableProps {
    orders: Order[];
    loading: boolean;
    onRefresh: () => void;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export default function OrdersTable({ orders, loading, onRefresh, onUpdateStatus }: OrdersTableProps) {
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStatusClick = async (id: string, status: string) => {
        setUpdating(id);
        await onUpdateStatus(id, status);
        setUpdating(null);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            preparing: "bg-blue-100 text-blue-800 border-blue-200",
            ready: "bg-purple-100 text-purple-800 border-purple-200",
            completed: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        }[status] || "bg-gray-100 text-gray-800 border-gray-200";

        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} capitalize`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-neutral-400" /></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-700">Recent Orders</h3>
                <button onClick={onRefresh} className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 text-gray-500">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Order ID</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Customer</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Total</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Payment</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Type</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Date</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-[#1A1A1A]">{order.user_name || "Guest"}</div>
                                    <div className="text-xs text-neutral-500">{order.user_email}</div>
                                    <div className="text-xs text-neutral-400">{order.phone}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    ₹{order.total.toLocaleString("en-IN")}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-medium text-neutral-600 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded w-fit">
                                        {order.payment_method}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.order_type === "table" ? "bg-indigo-50 text-indigo-700" : "bg-orange-50 text-orange-700"
                                        }`}>
                                        {order.order_type === "table" ? "Dine-in" : "Pickup"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4 text-xs text-neutral-400">
                                    {format(new Date(order.created_at), "MMM d, h:mm a")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button
                                            title="Mark Preparing"
                                            disabled={updating === order.id}
                                            onClick={() => handleStatusClick(order.id, "preparing")}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <PlayCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            title="Mark Ready"
                                            disabled={updating === order.id}
                                            onClick={() => handleStatusClick(order.id, "ready")}
                                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                        <button
                                            title="Mark Completed"
                                            disabled={updating === order.id}
                                            onClick={() => handleStatusClick(order.id, "completed")}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {orders.length === 0 && !loading && (
                <div className="p-8 text-center text-gray-500">
                    No orders found
                </div>
            )}
        </div>
    );
}
