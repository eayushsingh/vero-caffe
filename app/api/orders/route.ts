
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        // Admin Fetch - All Orders
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: orders, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json({ orders: orders || [] })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
