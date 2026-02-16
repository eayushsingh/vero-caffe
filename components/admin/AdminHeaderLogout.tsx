"use client"

import { createClient } from "@/lib/supabase/client"

export default function AdminHeaderLogout() {
    return (
        <button
            onClick={async () => {
                try {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    await fetch("/api/auth/logout", {
                        method: "POST"
                    })
                    window.location.href = "/"
                } catch (error) {
                    console.error("Logout error:", error)
                    window.location.href = "/"
                }
            }}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
            Logout
        </button>
    )
}
