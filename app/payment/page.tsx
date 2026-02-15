"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient as supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Invalid Order ID");
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth");
                return;
            }

            try {
                const res = await fetch(`/api/orders/user?orderId=${orderId}`, {
                    headers: {
                        "Authorization": `Bearer ${session.access_token}`
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch order");

                const data = await res.json();
                if (!data.order) throw new Error("Order not found");

                setOrder(data.order);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Order not found or access denied.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, router]);

    const handlePayment = async () => {
        if (!order) return;
        setProcessing(true);

        try {
            // 1. Create Razorpay Order securely on server
            const res = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: order.id }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to initialize payment");
            }

            const { razorpay_order_id: rzpOrderId, amount } = await res.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.subtotal * 100,
                currency: "INR",
                name: "VERO CAFFÉ",
                description: `Order #${order.id.slice(0, 8)}`,
                order_id: rzpOrderId,
                handler: async function (response: any) {
                    // Success! Call Secure API to verify signature and update status
                    setProcessing(true);
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order.id
                            })
                        });

                        if (!verifyRes.ok) {
                            const errorData = await verifyRes.json();
                            throw new Error(errorData.error || "Verification failed");
                        }

                        router.push(`/success?orderId=${order.id}`);
                    } catch (err: any) {
                        console.error("Verification error:", err);
                        alert(`Payment was successful but verification failed: ${err.message}. Please contact support.`);
                    } finally {
                        setProcessing(false);
                    }
                },
                theme: { color: "#6A4B3A" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#6A4B3A] animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-serif text-[#1A1A1A] mb-2">Order Error</h1>
                <p className="text-neutral-500 mb-6">{error || "Something went wrong."}</p>
                <Link href="/menu">
                    <Button variant="outline">Return to Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <Link
                    href="/checkout"
                    className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#1A1A1A] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                </Link>

                <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
                    <div className="p-8 border-b border-neutral-100 bg-[#6A4B3A] text-white text-center">
                        <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">Total Amount</p>
                        <h1 className="text-4xl font-serif">₹{(order.subtotal * 1.05).toLocaleString("en-IN")}</h1>
                        <p className="text-xs opacity-75 mt-2">Includes Taxes</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-center py-3 border-b border-dashed border-neutral-200">
                            <span className="text-neutral-500">Order ID</span>
                            <span className="font-mono text-sm text-[#1A1A1A]">{order.id}</span>
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-xl flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#6A4B3A] mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A]">Secure Payment</h3>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Your transaction is encrypted and secured by Razorpay.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full h-14 rounded-xl bg-[#6A4B3A] text-white hover:bg-[#5A3F31] text-lg font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Pay Now
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-neutral-400 mt-6">
                    VERO CAFFÉ • Crafted Coffee Experience
                </p>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#6A4B3A] animate-spin" />
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
