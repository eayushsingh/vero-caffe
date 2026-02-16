"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function AdminOrderRow({ order }: { order: any }) {
    const [status, setStatus] = useState(order.order_status || "pending")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        try {
            const res = await fetch("/api/orders/update-status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: order.id, status: newStatus })
            })

            if (!res.ok) throw new Error("Update failed")

            setStatus(newStatus)
            router.refresh()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case "pending": return "bg-gray-100 text-gray-800"
            case "preparing": return "bg-yellow-100 text-yellow-800"
            case "ready": return "bg-blue-100 text-blue-800"
            case "completed": return "bg-green-100 text-green-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 font-mono text-xs">
                {order.id.slice(0, 8)}...
            </td>
            <td className="px-6 py-4">
                {format(new Date(order.created_at), 'MMM d, p')}
            </td>
            <td className="px-6 py-4">
                <div className="font-medium">{order.name}</div>
                <div className="text-gray-500 text-xs">{order.phone}</div>
            </td>
            <td className="px-6 py-4">
                <div className="max-w-xs truncate">
                    {order.order_items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                </div>
            </td>
            <td className="px-6 py-4 font-medium">
                ₹{order.total}
            </td>
            <td className="px-6 py-4">
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={loading}
                        className={`text-xs font-semibold uppercase rounded-full px-3 py-1 border-none outline-none cursor-pointer appearance-none ${getStatusColor(status)} pr-8`}
                    >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </td>
            <td className="px-6 py-4">
                <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                    View
                </Link>
            </td>
        </tr>
    )
}
