import { NextResponse } from "next/server";
import { supabaseServer as supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: Request) {
    // Get token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    try {
        if (orderId) {
            // Fetch Single Order
            const { data, error } = await supabaseAdmin
                .from("orders")
                .select("*")
                .eq("id", orderId)
                // STRICT SECURITY: Ensure the order belongs to this user (by email)
                .eq("user_email", user.email)
                .single();

            if (error || !data) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }
            return NextResponse.json({ order: data });
        } else {
            // Fetch All User Orders
            const { data, error } = await supabaseAdmin
                .from("orders")
                .select("*")
                .eq("user_email", user.email)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return NextResponse.json({ orders: data });
        }
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
