"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    orderId: string;
    currentStatus: string;
}

export default function StatusSelect({ orderId, currentStatus }: Props) {

    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleUpdate = async (newStatus: string) => {

        // Optimistic UI
        setStatus(newStatus);
        setLoading(true);

        try {
            const { error } = await supabase
                .from("orders")
                .update({ order_status: newStatus })
                .eq("id", orderId);

            if (error) {
                console.error("Update failed:", error);
                // Revert on fail
                setStatus(currentStatus);
                alert("Status update failed");
            }
        } catch (err) {
            console.error("Critical update error:", err);
            setStatus(currentStatus);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <select
                value={status}
                onChange={(e) => handleUpdate(e.target.value)}
                disabled={loading}
                className="
          appearance-none 
          bg-white 
          border border-gray-200 
          text-gray-700 
          py-1 px-3 pr-8 
          rounded-full 
          leading-tight 
          focus:outline-none 
          focus:bg-white 
          focus:border-gray-500 
          text-sm
        "
            >
                <option value="pending">pending</option>
                <option value="ready">ready</option>
                <option value="completed">completed</option>
            </select>

            {loading && (
                <div className="absolute right-2 top-1.5 pointer-events-none">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
            )}
        </div>
    );
}
