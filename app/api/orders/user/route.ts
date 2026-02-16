
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const authClient = await getSupabaseServerClient()
        const { data: { user } } = await authClient.auth.getUser()

        const { searchParams } = new URL(req.url)
        const guestId = searchParams.get("guest_id")
        const phone = searchParams.get("phone")

        let query = supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false })

        if (user) {
            // If logged in, fetch by user_id
            query = query.eq("user_id", user.id)
        } else {
            // If guest, fetch by guest_id OR phone
            // Supabase .or() syntax: "guest_id.eq.value,phone.eq.value"
            // But we need to be careful. If both provided, match either?
            // Usually user provides one context.

            if (guestId) {
                query = query.eq("guest_id", guestId)
            } else if (phone) {
                query = query.eq("phone", phone)
            } else {
                // No identity = no orders
                return NextResponse.json({ orders: [] })
            }
        }

        const { data: orders, error } = await query

        if (error) throw error

        return NextResponse.json({ orders: orders || [] })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
