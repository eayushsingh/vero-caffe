"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { Loader2, Trash2, Edit, X, UploadCloud, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
}

export default function AdminMenuItems({ onEdit }: { onEdit?: (item: any) => void }) {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch("/api/admin/menu", {
                headers: { "Authorization": `Bearer ${session.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } catch (error) {
            console.error("Error fetching menu items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // --- DELETE LOGIC ---
    const handleDelete = async (item: MenuItem) => {
        if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Unauthorized");
                return;
            }

            // 1. Delete from Storage if image exists (Client-side)
            if (item.image_url) {
                const path = item.image_url.split("/").pop(); // Extract filename
                if (path) {
                    await supabase.storage.from("menu-images").remove([path]);
                }
            }

            // 2. Delete from DB via API
            const res = await fetch(`/api/admin/menu?id=${item.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${session.access_token}` }
            });

            if (!res.ok) throw new Error("Failed to delete item via API");

            // 3. Update Local State
            setItems(items.filter((i) => i.id !== item.id));
            alert("Item deleted.");

        } catch (error: any) {
            console.error("Delete failed:", error);
            alert("Failed to delete item.");
        }
    };

    // --- EDIT LOGIC ---
    const openEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setEditForm({ ...item }); // Clone data
        setEditImageFile(null);
        setEditImagePreview(null);
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        setSaving(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Unauthorized");
                return;
            }

            let finalImageUrl = editForm.image_url;

            // 1. Upload New Image if selected (Client-side)
            if (editImageFile) {
                // Remove old image first if exists
                if (editingItem.image_url) {
                    const oldPath = editingItem.image_url.split("/").pop();
                    if (oldPath) await supabase.storage.from("menu-images").remove([oldPath]);
                }

                const timestamp = Date.now();
                const sanitizedName = editImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const filePath = `${timestamp}-${sanitizedName}`;

                const { error: uploadError } = await supabase.storage
                    .from("menu-images")
                    .upload(filePath, editImageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("menu-images")
                    .getPublicUrl(filePath);

                finalImageUrl = data.publicUrl;
            }

            // 2. Update DB via API
            const res = await fetch("/api/admin/menu", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    id: editingItem.id,
                    name: editForm.name,
                    description: editForm.description,
                    price: editForm.price,
                    category: editForm.category,
                    image_url: finalImageUrl,
                })
            });

            if (!res.ok) throw new Error("Failed to update items via API");

            // 3. Refresh & Close
            alert("Item updated successfully!");
            setEditingItem(null);
            fetchItems(); // Refresh list

        } catch (error: any) {
            console.error("Update failed:", error);
            alert("Failed to update item: " + error.message);
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6A4B3A]" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1A1A1A]">Menu Management</h2>
                <span className="text-sm text-gray-500">{items.length} items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow relative">
                        <div className="relative h-48 bg-gray-100">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                <span className="font-bold text-[#6A4B3A]">₹{item.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md capitalize">
                                {item.category}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* EDIT MODAL */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">Edit {editingItem.name}</h3>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div className="flex flex-col items-center gap-4 mb-4">
                                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    {(editImagePreview || editForm.image_url) ? (
                                        <img
                                            src={editImagePreview || editForm.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                                        <UploadCloud className="w-6 h-6 mr-2" /> Change Image
                                        <input type="file" className="hidden" accept="image/*" onChange={handleEditImageChange} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name || ""}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={editForm.price || ""}
                                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                                        required
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={editForm.category || "coffee"}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                                    >
                                        <option value="coffee">Coffee</option>
                                        <option value="tea">Tea</option>
                                        <option value="bakery">Bakery</option>
                                        <option value="drinks">Drinks</option>
                                        <option value="breakfast">Breakfast</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.description || ""}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setEditingItem(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-[#6A4B3A] hover:bg-[#5A3F31] text-white"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
