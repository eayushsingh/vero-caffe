import { createClient } from "@/lib/supabase-server";
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
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        return NextResponse.redirect(new URL("/admin", siteUrl));
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", request.url));
    }
}
