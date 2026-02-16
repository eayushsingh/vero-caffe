import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { orderId, status } = body

        if (!orderId || !status) {
            return NextResponse.json(
                { error: "Missing orderId or status" },
                { status: 400 }
            )
        }

        const allowedStatuses = ["pending", "preparing", "ready", "completed", "cancelled"]
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            )
        }

        // Initialize Admin Client (Service Role)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error } = await supabase
            .from("orders")
            .update({ order_status: status })
            .eq("id", orderId)

        if (error) {
            console.error("STATUS UPDATE ERROR:", error)
            throw error
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error("API Error:", error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
