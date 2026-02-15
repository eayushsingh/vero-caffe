"use client";

import { useState } from "react";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddMenuItem({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const initialFormState = {
        name: "",
        description: "",
        price: "",
        category: "coffee",
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 0. Security Check & Session for API
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || session.user.email !== "admin@verocafe.com") {
                throw new Error("Unauthorized: Admin access required.");
            }

            let imageUrl = "";

            // 1. Upload Image (Client-side directly to Storage)
            if (imageFile) {
                const timestamp = Date.now();
                // Sanitize filename to avoid weird characters
                const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const filePath = `${timestamp}-${sanitizedName}`;

                const { error: uploadError } = await supabase.storage
                    .from("menu-images")
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("menu-images")
                    .getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // 2. Insert into DB via API
            const res = await fetch("/api/admin/menu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    image_url: imageUrl,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to add item");
            }

            // 3. Reset Form & Notify
            alert("Item added successfully!");
            setFormData(initialFormState);
            setImageFile(null);
            setPreviewUrl(null);
            onSuccess(); // Triggers refresh in parent

        } catch (error: any) {
            console.error("Error adding item:", error);
            alert("Failed to add item: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-[#1A1A1A]">Add New Menu Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Item Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500 group-hover:text-[#6A4B3A] transition-colors" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="coffee">Coffee</option>
                        <option value="tea">Tea</option>
                        <option value="bakery">Bakery</option>
                        <option value="drinks">Drinks</option>
                        <option value="breakfast">Breakfast</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#6A4B3A] focus:border-[#6A4B3A]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-[#6A4B3A] hover:bg-[#5A3F31] text-white font-bold text-lg rounded-lg shadow-md transition-all"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        "Add Item to Menu"
                    )}
                </Button>
            </form>
        </div>
    );
}
