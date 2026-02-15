import { supabaseServer } from "./lib/supabase-server";

async function check() {
    const { data, error } = await supabaseServer.from("orders").select("*").limit(1);
    if (data && data.length > 0) {
        console.log("COLUMNS:", Object.keys(data[0]));
    } else {
        console.log("NO DATA TO CHECK COLUMNS");
    }
}

check();
