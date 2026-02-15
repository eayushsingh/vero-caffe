"use client";

import { useEffect, useState } from "react";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Orders data is not an array:", data);
                    setOrders([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // polling
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            fetchData();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#1A1A1A] font-serif">All Orders</h1>
            <OrdersTable
                orders={orders}
                loading={loading}
                onRefresh={fetchData}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
