
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import OrderStatusDropdown from "@/components/admin/OrderStatusDropdown" // Import the new client component

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/auth/login")
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            id,
            customer_name,
            customer_email,
            customer_phone,
            total,
            order_status,
            created_at,
            order_items(name, quantity)
        `)
        .order("created_at", { ascending: false })

    if (error) {
        return <div className="p-8 text-red-500">Error fetching orders: {error.message}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Orders</h1>
                <div className="text-sm text-gray-500">
                    Total: {orders?.length || 0}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items Summary</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders?.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                    <td className="px-6 py-4">{format(new Date(order.created_at), "MMM d, p")}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{order.customer_name}</div>
                                        <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-600 max-w-[200px] truncate">
                                            {order.order_items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ") || "No items"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{order.total}</td>
                                    <td className="px-6 py-4">
                                        {/* Use the client component here */}
                                        <OrderStatusDropdown order={order} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
