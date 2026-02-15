import { createClient } from "./supabase-server";

const ADMIN_EMAILS = [
    "ayushsinghe07@gmail.com",
    // Add other admin emails here
];

export async function isAdmin() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return false;

    return ADMIN_EMAILS.includes(user.email?.toLowerCase() || "");
}
