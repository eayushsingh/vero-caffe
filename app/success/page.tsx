"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, Coffee } from "lucide-react"
import { Suspense } from "react"

function SuccessContent() {
    const searchParams = useSearchParams()
    const method = searchParams.get("method")
    const orderId = searchParams.get("order_id")

    const isOnline = method === "online"

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl text-[#1A1A1A] mb-4">
                    {isOnline ? "Payment Successful!" : "Order Placed!"}
                </h1>

                {/* Message based on payment method */}
                {isOnline ? (
                    <div className="space-y-4">
                        <p className="text-neutral-600 text-lg">
                            Your payment has been received.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 justify-center">
                            <Coffee className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">
                                Your order is being prepared!
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-neutral-600 text-lg">
                            Your order has been placed successfully.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span className="text-amber-700 font-medium">
                                Please pay at the counter
                            </span>
                        </div>
                        <p className="text-sm text-neutral-500">
                            Preparation will start after payment is confirmed.
                        </p>
                    </div>
                )}

                {/* Order ID */}
                {orderId && (
                    <div className="mt-8 p-4 bg-white rounded-xl border border-neutral-200">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Order ID</p>
                        <p className="font-mono text-sm text-[#1A1A1A]">{orderId}</p>
                    </div>
                )}

                {/* Back to Menu Button */}
                <div className="mt-10">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#6A4B3A] text-white rounded-full font-semibold hover:bg-[#5A3F31] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Coffee className="w-4 h-4" />
                        Order More
                    </Link>
                </div>

                {/* Thank You */}
                <p className="mt-8 text-sm text-neutral-400">
                    Thank you for choosing VERO CAFFÉ
                </p>
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#6A4B3A] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
