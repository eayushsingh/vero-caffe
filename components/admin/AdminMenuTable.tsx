"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Plus } from "lucide-react";
import AddMenuForm from "./AddMenuForm";

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function AdminMenuTable({ initialItems }: { initialItems: MenuItem[] }) {
    // Rely on initialItems for SSR data, but keep local state for updates/deletes
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [showAddForm, setShowAddForm] = useState(false);

    // Sync with server if needed
    useEffect(() => {
        setItems(initialItems as MenuItem[]);
    }, [initialItems]);

        const handleSave = async (id: string, price: number) => {
            try {
                const res = await fetch("/api/admin/menu/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id,
                        price: Number(price)
                    })
                })

                const data = await res.json()

                if (!res.ok) {
                    alert("Database update failed: " + data.error)
                    return
                }

                alert("Price updated successfully")

            } catch (err) {
                console.error(err)
                alert("Update failed")
            }
        }

    const updateItem = async (item: MenuItem) => {
        try {
            const res = await fetch("/api/admin/menu/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });

            if (!res.ok) {
                alert("Update failed");
                return;
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Update failed");
        }
    };

    const handleLocalChange = (id: number, field: keyof MenuItem, value: string | number) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleBlur = (item: MenuItem) => {
        updateItem(item);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems((prev) => prev.filter((i) => i.id !== id));
            } else {
                alert("Failed to delete item");
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    // helper to map category -> image path (avoid inline object literal inside JSX)
    const categoryImage = (category: string) => {
        switch (category) {
            case "Coffee":
                return "/coffee.jpg";
            case "Speciality Drinks":
                return "/speciality.jpg";
            case "Signature Bites":
                return "/bites.jpg";
            default:
                return "/logo.svg";
        }
    };

    const refreshData = () => {
        window.location.reload();
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Menu Items</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[#6A4B3A] text-white px-4 py-2 rounded-lg hover:bg-[#5A3F31] transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <AddMenuForm
                            onClose={() => setShowAddForm(false)}
                            onSuccess={() => {
                                setShowAddForm(false);
                                refreshData();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Image</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Name</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Category</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600">Price</th>
                            <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={categoryImage(item.category)}
                                            width={50}
                                            height={50}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                                    <input
                                        value={item.name}
                                        onChange={(e) => handleLocalChange(item.id, "name", e.target.value)}
                                        onBlur={() => handleBlur(item)}
                                        className="border-none bg-transparent w-full focus:ring-1 focus:ring-[#6A4B3A] rounded px-1"
                                    />
                                </td>
                                <td className="px-6 py-4 text-neutral-600">
                                    <input
                                        value={item.category}
                                        onChange={(e) => handleLocalChange(item.id, "category", e.target.value)}
                                        onBlur={() => handleBlur(item)}
                                        className="border-none bg-transparent w-full focus:ring-1 focus:ring-[#6A4B3A] rounded px-1 capitalize"
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    <div className="flex items-center">
                                        <span className="mr-1">₹</span>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) =>
                                                setItems((prev) =>
                                                    prev.map((i) =>
                                                        i.id === item.id ? { ...i, price: parseFloat(e.target.value) || 0 } : i
                                                    )
                                                )
                                            }
                                            className="border rounded px-2 py-1 w-24"
                                        />
                                        <button
                                            onClick={() => handleSave(String(item.id), item.price)}
                                            className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
}
