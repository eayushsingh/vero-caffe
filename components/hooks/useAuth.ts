"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                console.error("Auth error:", error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}
