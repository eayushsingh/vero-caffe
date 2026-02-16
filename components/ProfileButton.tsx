"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            await fetch("/api/auth/logout", {
                method: "POST"
            });
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
        }
    };

    return (
        <button onClick={handleLogout} className="text-sm font-medium hover:underline">
            Logout
        </button>
    );
}
