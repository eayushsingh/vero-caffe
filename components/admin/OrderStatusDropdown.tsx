
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OrderStatusDropdown({ order }: { order: any }) {
    const router = useRouter()
    const [status, setStatus] = useState(order.order_status)
    const [loading, setLoading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setLoading(true)

        try {
            const res = await fetch("/api/admin/orders/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: order.id,
                    status: newStatus
                })
            })

            if (!res.ok) {
                console.error("Failed to update status")
                // revert or show error
            } else {
                router.refresh()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (s: string) => {
        const status = s ? s.toLowerCase() : "pending"
        switch (status) {
            case "pending": return "bg-gray-100 text-gray-800"
            case "ready": return "bg-yellow-100 text-yellow-800"
            case "completed": return "bg-green-100 text-green-800"
            case "cancelled": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={loading}
            className={`border rounded px-2 py-1 text-xs font-bold uppercase cursor-pointer ${getStatusColor(status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
            <option value="pending">Pending</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
        </select>
    )
}
