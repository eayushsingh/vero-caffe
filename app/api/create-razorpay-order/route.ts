
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
    try {
        // Validate env vars
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env.local");
            return NextResponse.json(
                { error: "Razorpay not configured on server" },
                { status: 500 }
            );
        }

        const { amount } = await req.json();

        // Validate amount
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount. Expected positive number." },
                { status: 400 }
            );
        }

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create Order
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `verocaffe_${Date.now()}`,
        });

        return NextResponse.json({ orderId: order.id }, { status: 200 });

    } catch (error) {
        console.error("Razorpay ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create Razorpay order" },
            { status: 500 }
        );
    }
}
