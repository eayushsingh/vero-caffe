"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, selectTotalQty, selectSubtotal } from "@/store/useCartStore";

/* ───────────────────────────── Data ───────────────────────────── */

interface MenuItem {
    name: string;
    price: string;
    numericPrice: number;
}

interface Category {
    title: string;
    subtitle: string;
    image: string;
    items: MenuItem[];
}

const CATEGORIES: Category[] = [
    {
        title: "Coffee",
        subtitle: "Single Origin · Precision Brewed",
        image: "/images/coffee.jpg",
        items: [
            { name: "Espresso", price: "₹180", numericPrice: 180 },
            { name: "Americano", price: "₹200", numericPrice: 200 },
            { name: "Cappuccino", price: "₹240", numericPrice: 240 },
            { name: "Latte", price: "₹260", numericPrice: 260 },
        ],
    },
    {
        title: "Speciality Drinks",
        subtitle: "Signature Cold & Creative",
        image: "/images/speciality.jpg",
        items: [
            { name: "Cold Brew", price: "₹260", numericPrice: 260 },
            { name: "Spanish Latte", price: "₹280", numericPrice: 280 },
            { name: "Iced Mocha", price: "₹300", numericPrice: 300 },
            { name: "Vanilla Cream", price: "₹320", numericPrice: 320 },
        ],
    },
    {
        title: "Signature Bites",
        subtitle: "Seasonal Plates",
        image: "/images/bites.jpg",
        items: [
            { name: "Avocado Toast", price: "₹320", numericPrice: 320 },
            { name: "French Toast", price: "₹340", numericPrice: 340 },
            { name: "Club Sandwich", price: "₹360", numericPrice: 360 },
            { name: "Breakfast Platter", price: "₹420", numericPrice: 420 },
        ],
    },
];

/* ──────────────────────────── Component ──────────────────────── */

export default function MenuSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const items = useCartStore((s) => s.items);
    const cartOpen = useCartStore((s) => s.cartOpen);
    const setCartOpen = useCartStore((s) => s.setCartOpen);
    const addItem = useCartStore((s) => s.addItem);
    const decreaseQty = useCartStore((s) => s.decreaseQty);
    const totalQty = useCartStore(selectTotalQty);
    const subtotal = useCartStore(selectSubtotal);

    const toggle = (i: number) => {
        setOpenIndex((prev) => (prev === i ? null : i));
    };

    /* Helper: get qty for a menu item by name (used as id) */
    const getQty = (name: string) => items.find((i) => i.id === name)?.qty ?? 0;

    return (
        <>
            <section className="w-full py-16 sm:py-24 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-14"
                    >
                        <p className="text-xs tracking-[0.4em] text-neutral-400 uppercase mb-3">
                            Curated Selection
                        </p>
                        <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] uppercase text-[#1A1A1A]">
                            Our Menu
                        </h2>
                    </motion.div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {CATEGORIES.map((cat, i) => {
                            const isOpen = openIndex === i;

                            return (
                                <motion.div
                                    key={cat.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    onClick={() => toggle(i)}
                                    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-neutral-200 overflow-hidden cursor-pointer select-none shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            sizes="(max-width:768px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Title area */}
                                    <div className="p-5 sm:p-6">
                                        <p className="text-[10px] sm:text-xs tracking-[0.35em] text-neutral-400 uppercase mb-1">
                                            {cat.subtitle}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <h3
                                                className="font-serif text-xl sm:text-2xl tracking-wide text-[#1A1A1A] font-semibold"
                                            >
                                                {cat.title}
                                            </h3>
                                            <motion.span
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-neutral-400 text-lg"
                                            >
                                                ▾
                                            </motion.span>
                                        </div>
                                    </div>

                                    {/* Expandable items */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <ul className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
                                                    <li className="border-t border-neutral-100 mb-2" />
                                                    {cat.items.map((item) => {
                                                        const qty = getQty(item.name);

                                                        return (
                                                            <li
                                                                key={item.name}
                                                                className="flex items-center justify-between gap-2"
                                                            >
                                                                {/* Name + dotted line + price */}
                                                                <span className="text-sm text-neutral-800 font-medium whitespace-nowrap">
                                                                    {item.name}
                                                                </span>
                                                                <span className="flex-1 mx-2 border-b border-dotted border-neutral-200 min-w-4" />
                                                                <span className="text-sm text-neutral-500 tabular-nums whitespace-nowrap">
                                                                    {item.price}
                                                                </span>

                                                                {/* Quantity controls */}
                                                                <div
                                                                    className="flex items-center gap-1.5 ml-3"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <AnimatePresence mode="wait">
                                                                        {qty === 0 ? (
                                                                            <motion.button
                                                                                key="add"
                                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                                animate={{ scale: 1, opacity: 1 }}
                                                                                exit={{ scale: 0.8, opacity: 0 }}
                                                                                transition={{ duration: 0.15 }}
                                                                                aria-label={`Add ${item.name}`}
                                                                                onClick={() => addItem({ id: item.name, name: item.name, price: item.numericPrice, image: cat.image })}
                                                                                className="w-7 h-7 flex items-center justify-center rounded-full border border-[#6A4B3A] text-[#6A4B3A] text-sm font-medium hover:bg-[#6A4B3A] hover:text-white transition-colors duration-200"
                                                                            >
                                                                                +
                                                                            </motion.button>
                                                                        ) : (
                                                                            <motion.div
                                                                                key="stepper"
                                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                                animate={{ scale: 1, opacity: 1 }}
                                                                                exit={{ scale: 0.8, opacity: 0 }}
                                                                                transition={{ duration: 0.15 }}
                                                                                className="flex items-center gap-1.5"
                                                                            >
                                                                                <button
                                                                                    aria-label={`Remove one ${item.name}`}
                                                                                    onClick={() => decreaseQty(item.name)}
                                                                                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#6A4B3A]/30 text-[#6A4B3A] text-sm font-medium hover:bg-[#6A4B3A] hover:text-white transition-colors duration-200"
                                                                                >
                                                                                    −
                                                                                </button>
                                                                                <span className="w-5 text-center text-sm tabular-nums font-medium text-[#1A1A1A]">
                                                                                    {qty}
                                                                                </span>
                                                                                <button
                                                                                    aria-label={`Add one ${item.name}`}
                                                                                    onClick={() => addItem({ id: item.name, name: item.name, price: item.numericPrice, image: cat.image })}
                                                                                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#6A4B3A] text-[#6A4B3A] text-sm font-medium hover:bg-[#6A4B3A] hover:text-white transition-colors duration-200"
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Floating Cart Bar ─── */}
            <AnimatePresence>
                {totalQty > 0 && !cartOpen && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
                        onClick={() => setCartOpen(true)}
                    >
                        <div className="flex items-center gap-4 sm:gap-6 bg-[#6A4B3A] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:bg-[#5A3F31] transition-colors duration-200">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="text-xs sm:text-sm tracking-wide opacity-80">
                                    View Order
                                </span>
                                <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-sm font-semibold tabular-nums">
                                    {totalQty}
                                </span>
                            </div>
                            <span className="w-px h-5 bg-white/20" />
                            <span className="text-sm sm:text-base font-semibold tabular-nums">
                                ₹{subtotal.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </>
    );
}
