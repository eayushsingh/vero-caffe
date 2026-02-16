
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, phone, email, items, total, payment_method, notes, guest_id } = body

        if (!items || !items.length) {
            return NextResponse.json({ error: "No items" }, { status: 400 })
        }

        // Initialize Admin Client (Bypass RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Determine User (Auth vs Guest)
        const authClient = await getSupabaseServerClient()
        const { data: { user } } = await authClient.auth.getUser()
        const userId = user?.id || null

        // Insert Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: userId,
                customer_name: name,
                customer_email: email || user?.email || null,
                customer_phone: phone,
                total: total,
                order_status: "pending",
                payment_status: "pending"
            })
            .select()
            .single()

        if (orderError) {
            console.error("ORDER INSERT ERROR:", orderError)
            throw new Error(orderError.message)
        }

        // Fetch images from menu_items to ensure we have them
        const itemIds = items.map((item: any) => item.id)
        const { data: menuItems } = await supabase
            .from("menu_items")
            .select("id, image")
            .in("id", itemIds)

        const imageMap: Record<string, string> = {}
        if (menuItems) {
            menuItems.forEach((mi: any) => {
                if (mi.image) imageMap[mi.id] = mi.image
            })
        }

        // Insert Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            menu_item_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            // Prioritize item.image if sent, otherwise fallback to database lookup
            image: item.image || imageMap[item.id] || null
        }))

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems)

        if (itemsError) {
            console.error("ITEMS INSERT ERROR:", itemsError)
            throw new Error(itemsError.message)
        }

        return NextResponse.json({
            success: true,
            orderId: order.id
        })

    } catch (error: any) {
        console.error("API ERROR:", error)
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        )
    }
}
