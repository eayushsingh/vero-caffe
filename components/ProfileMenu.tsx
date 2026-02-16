"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/hooks/useAuth";
import { useCartStore } from "@/store/useCartStore";
import NavbarAvatar from "@/components/NavbarAvatar";

const ADMIN_EMAILS = ["ayushsinghe07@gmail.com"];

export default function ProfileMenu() {
    const supabase = createClient();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const clearCart = useCartStore((s) => s.clearCart);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            await fetch("/api/auth/logout", {
                method: "POST"
            });
            clearCart();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
        }
    };

    if (!user) {
        return (
            <Link href="/auth/login">
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 hover:border-[#6A4B3A] text-neutral-600 hover:text-[#6A4B3A] transition-colors"
                    aria-label="Sign In"
                >
                    <User className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </button>
            </Link>
        );
    }

    const isUserAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;
    const userName = user.user_metadata?.full_name || "User";
    const userEmail = user.email;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 hover:border-[#6A4B3A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6A4B3A]/20"
            >
                <NavbarAvatar />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 origin-top-right overflow-hidden"
                    >
                        <div className="px-5 py-4 border-b border-neutral-50 bg-neutral-50/30">
                            <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{userEmail}</p>
                        </div>

                        <div className="py-2">
                            {isUserAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-green-700 bg-green-50/50 hover:bg-green-100 transition-colors font-medium border-l-2 border-green-600 mb-1"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}

                            <Link
                                href="/orders"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-5 py-2.5 text-sm text-[#1A1A1A] hover:bg-neutral-50 transition-colors"
                            >
                                <Package className="w-4 h-4 text-neutral-500" />
                                <span>My Orders</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
