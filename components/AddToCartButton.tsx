"use client"

import React, { useEffect } from "react"
import { useCartStore } from "@/store/useCartStore"
import { Minus, Plus } from "lucide-react"

interface Props {
  item: {
    id: string
    name: string
    price: number | string
    image?: string | null
    image_url?: string | null
    category?: string
  }
  categoryImage?: string
}

export default function AddToCartButton({ item, categoryImage }: Props) {
  // Get quantity from cart for this specific item
  const quantity = useCartStore((state) => {
    const cartItem = state.items.find((i) => i.id === String(item.id))
    return cartItem?.quantity ?? 0
  })

  const addItem = useCartStore((state) => state.addItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const hydrated = useCartStore((state) => state.hydrated)

  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  if (!hydrated) return null

  // Determine best image: item.image_url > item.image > categoryImage > fallback
  const itemImage = item.image_url || item.image || categoryImage || "/coffee.jpg"

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: String(item.id),
      name: String(item.name),
      price: Number(item.price),
      image: itemImage,
      category: item.category, // Pass category
      quantity: 1,
    })
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQuantity(String(item.id), quantity - 1)
  }

  // State 1: Show "Add" button when quantity is 0
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="ml-3 inline-flex items-center px-4 py-1.5 rounded-full bg-[#6A4B3A] text-white text-sm font-medium hover:bg-[#5A3F31] transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Add
      </button>
    )
  }

  // State 2+: Show quantity stepper [ - qty + ]
  return (
    <div className="ml-3 inline-flex items-center gap-0 rounded-full bg-[#6A4B3A] overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={handleDecrease}
        className="flex items-center justify-center w-8 h-8 text-white hover:bg-[#5A3F31] transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="flex items-center justify-center min-w-[28px] h-8 text-white text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center justify-center w-8 h-8 text-white hover:bg-[#5A3F31] transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
