"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/");
    };

    return (
        <button onClick={handleLogout} className="text-sm font-medium hover:underline">
            Logout
        </button>
    );
}
