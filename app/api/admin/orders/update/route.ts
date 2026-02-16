import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return new Response(JSON.stringify({ error: "Missing orderId or status" }), { status: 400 });
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) {
            console.error("Update Status Error:", error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Server Error" }), { status: 500 });
    }
}
