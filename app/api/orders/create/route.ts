import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// Type for cart items from client
interface CartItemInput {
    id?: string;
    name: string;
    price: number;
    quantity?: number;
    qty?: number;
    image?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const {
            items,
            payment_method = "counter",
            user_email,
            user_name,
            phone,
            order_type,
            table_number,
            notes,
        } = body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Cart items are required" },
                { status: 400 }
            );
        }

        if (!user_name || !phone) {
            return NextResponse.json(
                { error: "Name and phone are required" },
                { status: 400 }
            );
        }

        // SECURITY: Calculate total on server - NEVER trust client total
        let serverCalculatedTotal = 0;
        const formattedItems = items.map((item: CartItemInput) => {
            const quantity = item.quantity || item.qty || 1;
            const price = Number(item.price) || 0;
            
            // Validate price is positive
            if (price <= 0 || quantity <= 0) {
                throw new Error("Invalid item price or quantity");
            }
            
            serverCalculatedTotal += price * quantity;
            
            return {
                id: item.id || null,
                name: item.name,
                price: price,
                qty: quantity,
                image: item.image || null,
            };
        });

        // Validate total is reasonable
        if (serverCalculatedTotal <= 0) {
            return NextResponse.json(
                { error: "Invalid order total" },
                { status: 400 }
            );
        }

        // Create order with server-calculated total
        // Use guest email if no user email provided (for guest checkout)
        const emailToUse = user_email || `guest_${Date.now()}@verocaffe.local`;
        
        const orderData = {
            status: "pending",
            payment_method: payment_method.toUpperCase(), // "ONLINE" or "COUNTER"
            user_email: emailToUse,
            user_name: user_name,
            phone: phone,
            items: formattedItems,
            total: serverCalculatedTotal, // Server-calculated, not client-provided
            order_type: order_type || null,
        };

        const { data: order, error: orderError } = await supabaseServer
            .from("orders")
            .insert([orderData])
            .select()
            .single();

        if (orderError) {
            console.error("Supabase Order Insert Error:", orderError);
            return NextResponse.json(
                { error: orderError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                success: true,
                order_id: order.id,
                total: serverCalculatedTotal,
                message: "Order created successfully" 
            },
            { status: 201 }
        );

    } catch (err: unknown) {
        console.error("Order Creation Error:", err);
        const errorMessage = err instanceof Error ? err.message : "Server error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
