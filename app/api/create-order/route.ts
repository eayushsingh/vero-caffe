import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart empty" }, { status: 400 });
        }

        // Calculate total amount from items
        const amount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys missing");
            return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({ id: order.id, amount: order.amount }, { status: 200 });
    } catch (error) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
