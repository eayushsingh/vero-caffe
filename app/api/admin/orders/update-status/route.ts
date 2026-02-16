
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { orderId, status } = await req.json();

        const { error } = await supabase
            .from("orders")
            .update({
                order_status: status
            })
            .eq("id", orderId);

        if (error) {
            console.error("Status update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
