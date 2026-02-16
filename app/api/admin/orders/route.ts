import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // SECURITY: Verify admin status
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all orders sorted by newest first
        const supabase = await createClient();
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Orders Fetch Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return the orders directly as an array (or wrapped object if preferred, but existing code used array or object)
        // Existing code: return NextResponse.json(data, { status: 200 });
        // Let's stick to return { orders: ... } or just array based on usage. 
        // AdminOrders.tsx expected { orders: [...] }
        return NextResponse.json(orders);

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
    }
}
