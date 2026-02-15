"use client";

import { createClient } from "@/lib/supabase-client";
import Image from "next/image";

export default function LoginPage() {
    const supabase = createClient();

    const signIn = async () => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${siteUrl}/auth/callback`,
            },
        });

        if (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7]">
            <div className="mb-8">
                <Image
                    src="/logo.svg"
                    alt="VERO CAFFÉ"
                    width={140}
                    height={140}
                    priority
                    className="object-contain"
                />
            </div>
            <button
                onClick={signIn}
                className="bg-white text-[#1A1A1A] border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
        </div>
    );
}
