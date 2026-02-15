import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseServer as supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // 1. Fetch order from DB to get actual amount
        const { data: order, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("total, status")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.status === "COMPLETED") {
            return NextResponse.json({ error: "Order already paid" }, { status: 400 });
        }

        // 2. Create Razorpay Order
        const rzpOrder = await razorpay.orders.create({
            amount: Math.round(order.total * 100), // convert to paise
            currency: "INR",
            receipt: orderId,
        });

        return NextResponse.json({
            success: true,
            razorpay_order_id: rzpOrder.id,
            amount: rzpOrder.amount
        });

    } catch (error: any) {
        console.error("Razorpay Create Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 });
    }
}
