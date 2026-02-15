"use client";

import { supabaseClient as supabase } from "@/lib/supabase-client";
import Image from "next/image";

export default function GoogleLoginButton() {
  const signInWithGoogle = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectTo = `${siteUrl}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all group bg-white hover:border-neutral-300 shadow-sm"
    >
      <div className="relative w-5 h-5">
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          fill
          className="object-contain"
        />
      </div>
      <span className="font-medium text-neutral-600 group-hover:text-neutral-900">
        Continue with Google
      </span>
    </button>
  );
}
