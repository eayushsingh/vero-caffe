"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartStore {
    items: CartItem[];
    hydrated: boolean;
    cartOpen: boolean;

    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setHydrated: (state: boolean) => void;
    setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            hydrated: false,
            cartOpen: false,

            setHydrated: (state) => set({ hydrated: state }),
            setCartOpen: (open) => set({ cartOpen: open }),

            addItem: (item) => {
                const items = get().items;
                const existing = items.find((i) => i.id === item.id);

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, item] });
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),

            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);

// Helper selectors for components
export const selectTotalQty = (state: { items: CartItem[] }) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectSubtotal = (state: { items: CartItem[] }) =>
    state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
