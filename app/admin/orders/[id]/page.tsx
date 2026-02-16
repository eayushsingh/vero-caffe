
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"

// Admin View Order Page
export const dynamic = "force-dynamic"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Await params as required in Next.js 16
    const { id } = await params

    const supabase = await createClient()

    // Relational query as requested
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
            id,
            customer_name,
            customer_email,
            customer_phone,
            total,
            order_status,
            payment_status,
            created_at,
            order_items (
                id,
                name,
                price,
                quantity,
                image
            )
        `)
        .eq("id", id)
        .single()

    console.log("ORDER DATA:", order)
    console.log("ORDER ITEMS:", order?.order_items)

    if (error || !order) {
        console.error("Fetch Error:", error)
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-500">Order not found</h1>
                <Link href="/admin/orders" className="text-blue-500 underline mt-4 block">
                    Back to Orders
                </Link>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold font-serif">Order Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Customer</h2>
                    <div className="space-y-2">
                        <p><span className="text-gray-500">Name:</span> {order.customer_name}</p>
                        <p><span className="text-gray-500">Phone:</span> {order.customer_phone}</p>
                        <p><span className="text-gray-500">Email:</span> {order.customer_email || "N/A"}</p>
                        <p><span className="text-gray-500">ID:</span> {order.id}</p>
                    </div>
                </div>

                {/* Order Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Order Info</h2>
                    <div className="space-y-2">
                        <p><span className="text-gray-500">Date:</span> {format(new Date(order.created_at), "PPP p")}</p>
                        <p><span className="text-gray-500">Status:</span>
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">
                                {order.order_status}
                            </span>
                        </p>
                        <p><span className="text-gray-500">Payment:</span> {order.payment_status}</p>
                        <p><span className="text-gray-500">Total:</span> ₹{order.total}</p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Items</h2>
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Qty</th>
                            <th className="p-4">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item: any) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                            )}
                                            <span>{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">₹{item.price}</td>
                                    <td className="p-4">{item.quantity}</td>
                                    <td className="p-4">₹{item.price * item.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">No items found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
