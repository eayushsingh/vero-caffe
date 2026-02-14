"use client";

import { supabase } from "@/lib/supabase";

export default function GoogleLoginButton() {
  const getRedirectUrl = () => {
    // Check if we are in browser
    if (typeof window !== "undefined") {
      // Local development
      if (window.location.hostname === "localhost") {
        return `${window.location.origin}/checkout`;
      }
      // Production - always redirect to main domain
      return "https://vero-caffe.vercel.app/checkout";
    }
    // Server-side fallback (unused in client component but safe)
    return "https://vero-caffe.vercel.app/checkout";
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
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
