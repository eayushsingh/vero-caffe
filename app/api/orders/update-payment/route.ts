import { NextResponse } from "next/server";
import { supabaseServer as supabaseAdmin } from "@/lib/supabase-server";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status, payment_method } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Verify User Session
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify Order Ownership via Email
        const { data: existingOrder, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("user_email")
            .eq("id", orderId)
            .single();

        if (fetchError || !existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (existingOrder.user_email !== user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update Order
        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({
                status: status,
                payment_method: payment_method || "ONLINE", // Assuming 'ONLINE' if not provided
                payment_id: "ONLINE_PAID" // Update payment ID to indicate success
            })
            .eq("id", orderId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Update Payment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
