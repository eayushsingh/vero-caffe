"use client";

import { LogOut } from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                await supabaseClient.auth.signOut();
                router.push("/");
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
    );
}
