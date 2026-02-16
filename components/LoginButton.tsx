"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {

    const login = async () => {
        const supabase = createClient();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
            },
        });
    };

    return (
        <button onClick={login} className="px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors">
            Login with Google
        </button>
    );
}
