export const categoryImages: Record<string, string> = {
    coffee: "/coffee.jpg",    // Using existing reliable public URLs
    drinks: "/speciality.jpg",
    food: "/bites.jpg",
    dessert: "/bites.jpg",
    "speciality drinks": "/speciality.jpg",
    "signature bites": "/bites.jpg",
    default: "/coffee.jpg",
};

export function getItemImage(item: {
    image?: string | null;
    image_url?: string | null;
    category?: string | null;
    name?: string | null;
}) {
    // 1. Try direct image properties
    if (item?.image_url) return item.image_url;
    if (item?.image && item.image.startsWith("/")) return item.image;
    if (item?.image && item.image.startsWith("http")) return item.image;

    // 2. Try category fallback
    const category = item?.category?.toLowerCase()?.trim();

    if (category) {
        if (categoryImages[category]) return categoryImages[category];

        // Fuzzy match
        if (category.includes("coffee")) return categoryImages.coffee;
        if (category.includes("drink")) return categoryImages.drinks;
        if (category.includes("food") || category.includes("bite")) return categoryImages.food;
    }

    // 3. Try name fallback
    const name = item?.name?.toLowerCase();
    if (name) {
        if (name.includes("coffee") || name.includes("latte") || name.includes("cappuccino")) return categoryImages.coffee;
        if (name.includes("cake") || name.includes("croissant")) return categoryImages.food;
    }

    return categoryImages.default;
}
