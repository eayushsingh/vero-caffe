"use client";

import { createClient } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function ProfileInfo() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    if (!user) return null;

    return <div>{user.email}</div>;
}
