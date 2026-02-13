"use client";

import { supabase } from "@/lib/supabase";

export default function GoogleLoginButton() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="px-5 py-3 rounded-full bg-[#6A4B3A] text-white"
    >
      Continue with Google
    </button>
  );
}
