import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";

// Type for cart items from client
interface CartItemInput {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            items,
            payment_method = "COUNTER",
            user_email,
            user_name,
            phone,
            notes,
        } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart items are required" }, { status: 400 });
        }

        if (!user_name || !phone) {
            return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
        }

        // SECURITY: Calculate total on server
        let serverCalculatedTotal = 0;
        const formattedItems = items.map((item: CartItemInput) => {
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;

            if (price <= 0 || quantity <= 0) {
                throw new Error(`Invalid item: ${item.name}`);
            }

            serverCalculatedTotal += price * quantity;

            return {
                id: item.id,
                name: item.name,
                price: price,
                qty: quantity,
                image: item.image || null,
            };
        });

        // Create DB Order (Pending)
        const emailToUse = user_email || `guest_${Date.now()}@verocaffe.local`;

        const orderData = {
            status: "PENDING",
            payment_method: "COUNTER", // Force COUNTER for now
            user_email: emailToUse.toLowerCase(),
            user_name: user_name,
            phone: phone,
            items: formattedItems,
            total: serverCalculatedTotal,
            notes: notes || null,
        };

        const { data: order, error: orderError } = await supabaseServer
            .from("orders")
            .insert([orderData])
            .select()
            .single();

        if (orderError) {
            console.error("Supabase Order Insert Error:", orderError);
            return NextResponse.json({ error: orderError.message }, { status: 500 });
        }

        // Return success for COUNTER payment
        return NextResponse.json({
            success: true,
            order_id: order.id,
            message: "Order placed successfully"
        }, { status: 201 });

    } catch (err: any) {
        console.error("Order Creation Error:", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
