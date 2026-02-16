
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function NavbarAvatar() {
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user?.user_metadata?.avatar_url) {
                setAvatar(session.user.user_metadata.avatar_url);
            }
        };

        loadUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.user_metadata?.avatar_url) {
                setAvatar(session.user.user_metadata.avatar_url);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <Image
            src={avatar || "/default-avatar.png"}
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full border object-cover"
        />
    );
}
