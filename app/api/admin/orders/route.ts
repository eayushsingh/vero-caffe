import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // Fetch all orders sorted by newest first
        const { data, error } = await supabaseServer
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin Orders Fetch Error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Server Error" }), { status: 500 });
    }
}
