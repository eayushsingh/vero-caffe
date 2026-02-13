import { create } from "zustand";

/* ─── Types ─── */

export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addItem: (item: Omit<CartItem, "qty">) => void;
    removeItem: (id: string) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    clearCart: () => void;
}

/* ─── Store ─── */

export const useCartStore = create<CartState>((set) => ({
    items: [],
    cartOpen: false,

    setCartOpen: (open) => set({ cartOpen: open }),

    addItem: (item) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { ...item, qty: 1 }] };
        }),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    increaseQty: (id) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + 1 } : i
            ),
        })),

    decreaseQty: (id) =>
        set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (!item) return state;
            if (item.qty <= 1) {
                return { items: state.items.filter((i) => i.id !== id) };
            }
            return {
                items: state.items.map((i) =>
                    i.id === id ? { ...i, qty: i.qty - 1 } : i
                ),
            };
        }),

    clearCart: () => set({ items: [], cartOpen: false }),
}));

/* ─── Selectors ─── */

export const selectTotalQty = (state: CartState) =>
    state.items.reduce((sum, i) => sum + i.qty, 0);

export const selectSubtotal = (state: CartState) =>
    state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
