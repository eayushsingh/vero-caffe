import { supabaseServer } from "@/lib/supabase-server";
import { isAdmin } from "@/lib/supabase/admin";
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
        const { data, error } = await supabaseServer
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin Orders Fetch Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
    }
}
