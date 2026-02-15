import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get("code");

        if (code) {
            const supabase = await createClient();
            await supabase.auth.exchangeCodeForSession(code);
        }

        // URL to redirect to after sign in process completes
        return NextResponse.redirect(new URL("/admin", requestUrl.origin));
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url));
    }
}
