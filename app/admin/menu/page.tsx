import { createClient } from "@/lib/supabase/server";
import AdminMenuTable from "@/components/admin/AdminMenuTable";

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
    let menuItems = [];
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .order("category", { ascending: true });

        if (error) {
            console.error("Fetch error:", error);
        } else {
            menuItems = data || [];
        }
    } catch (e) {
        console.error("Admin fetch fail:", e);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Manage Menu</h1>
            <AdminMenuTable initialItems={menuItems || []} />
        </div>
    );
}
