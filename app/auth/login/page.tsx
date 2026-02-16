"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();

    const login = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7]">
            <div className="mb-8">
                <img
                    src="/logo.svg"
                    alt="VERO CAFFÉ"
                    width={140}
                    height={140}
                    className="object-contain"
                />
            </div>
            <button
                onClick={login}
                className="bg-white text-[#1A1A1A] border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
        </div>
    );
}
