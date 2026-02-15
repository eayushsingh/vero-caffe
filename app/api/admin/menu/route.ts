import { supabaseServer } from "@/lib/supabase-server";

export async function GET(req: Request) {
    try {
        const { data, error } = await supabaseServer
            .from("menu_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.price || !body.category) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from("menu_items")
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

        const { data, error } = await supabaseServer
            .from("menu_items")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new Response(JSON.stringify({ error: "Missing ID" }), { status: 400 });

        const { error } = await supabaseServer
            .from("menu_items")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
