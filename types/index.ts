export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    qty?: number; // handle inconsistency
    image?: string;
    category?: string;
    [key: string]: any;
}

export interface Order {
    id: string;
    created_at: string;
    status?: string;
    order_status?: string; // handle inconsistency
    total?: number;
    subtotal?: number; // handle inconsistency
    user_email?: string;
    name?: string;
    phone?: string;
    items: OrderItem[] | { cartItems: OrderItem[] };
    payment_method?: string;
    payment_id?: string;
    [key: string]: any;
}
