"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import { X, Upload, Loader2 } from "lucide-react";

interface AddMenuFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMenuForm({ onClose, onSuccess }: AddMenuFormProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "coffee",
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            // 1. Upload Image
            if (imageFile) {
                const filename = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabaseClient.storage
                    .from("menu-images")
                    .upload(filename, imageFile);

                if (error) throw error;

                // Get Public URL
                const { data: { publicUrl } } = supabaseClient.storage
                    .from("menu-images")
                    .getPublicUrl(filename);

                imageUrl = publicUrl;
            }

            // 2. Create Record via API (securely using Service Role on server)
            const res = await fetch("/api/admin/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    category: form.category,
                    image: imageUrl,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create item");
            }

            onSuccess();
        } catch (error: any) {
            console.error("Error adding item:", error);
            alert(error.message || "Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Add Menu Item</h3>
                <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block w-full h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#6A4B3A] hover:bg-neutral-50 transition-colors relative overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                                <span className="text-sm text-neutral-500">Upload Image</span>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-neutral-500">Name</label>
                        <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#6A4B3A]"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-neutral-500">Price (₹)</label>
                        <input
                            required
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#6A4B3A]"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-neutral-500">Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#6A4B3A] bg-white"
                    >
                        <option value="coffee">Coffee</option>
                        <option value="bakery">Bakery</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="dessert">Dessert</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-neutral-500">Description</label>
                    <textarea
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#6A4B3A]"
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 bg-[#6A4B3A] text-white rounded-xl font-semibold hover:bg-[#5A3F31] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Item"}
                </button>
            </form>
        </div>
    );
}
