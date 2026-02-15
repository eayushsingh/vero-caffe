import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { status } = body;
        const { id } = await params;

        if (!id || !status) {
            return new NextResponse(JSON.stringify({ error: "Missing ID or status" }), { status: 400 });
        }

        const { error } = await supabaseServer
            .from("orders")
            .update({ status })
            .eq("id", id);

        if (error) {
            console.error("Update Status Error:", error);
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        return new NextResponse(JSON.stringify({ error: err.message || "Server Error" }), { status: 500 });
    }
}
