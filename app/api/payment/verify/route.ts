import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer as supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // Our internal order ID (UUID)
        } = await req.json();

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        // 2. Update Order in Database
        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({
                status: "COMPLETED",
                payment_method: "ONLINE",
                payment_id: razorpay_payment_id,
                razorpay_order_id: razorpay_order_id
            })
            .eq("id", orderId);

        if (updateError) {
            console.error("Order Update Error:", updateError);
            return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Payment verified and order updated" });

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
