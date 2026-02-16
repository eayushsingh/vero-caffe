
export type Order = {
    id: string;
    user_id: string | null;
    name: string;
    phone: string;
    notes: string;
    total: number;
    status: string;
    created_at: string;
};

export type OrderItem = {
    id: string;
    order_id: string;
    item_id: string; // Assuming items still have IDs from menu
    name: string;
    price: number;
    quantity: number;
    created_at: string;
};
