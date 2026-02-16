import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import AddToCartButton from "./AddToCartButton"
import { getItemImage } from "@/lib/categoryImages"

export default async function MenuSection() {
	const supabase = await createClient();
	// Fetch live menu items from Supabase (server-side)
	const { data: menuItems, error } = await supabase
		.from("menu_items")
		.select("*")
		.order("category")

	if (error) {
		console.error("DATABASE FETCH ERROR:", error)
		return (
			<section className="w-full py-24 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="font-serif text-3xl">Our Menu</h2>
					<p className="text-sm text-neutral-500 mt-2">Unable to load menu.</p>
				</div>
			</section>
		)
	}

	const items = menuItems || []

	const coffee = items.filter((i: any) => i.category === "Coffee")
	const drinks = items.filter((i: any) => i.category === "Speciality Drinks")
	const food = items.filter((i: any) => i.category === "Signature Bites")

	const groups = [
		{ title: "Coffee", items: coffee, image: "/coffee.jpg", subtitle: "Single Origin · Precision Brewed" },
		{ title: "Speciality Drinks", items: drinks, image: "/speciality.jpg", subtitle: "Signature Cold & Creative" },
		{ title: "Signature Bites", items: food, image: "/bites.jpg", subtitle: "Seasonal Plates" },
	]

	return (
		<section className="w-full py-16 sm:py-24 px-4 sm:px-6 relative z-10">
			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-14">
					<p className="text-xs tracking-[0.4em] text-neutral-400 uppercase mb-3">Curated Selection</p>
					<h2 className="font-serif text-3xl sm:text-4xl tracking-[0.1em] uppercase text-[#1A1A1A]">Our Menu</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
					{groups.map((cat, i) => {
						return (
							<div
								key={cat.title}
								className="bg-white/70 backdrop-blur-xl rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
							>
								<div className="relative w-full h-44 sm:h-52 overflow-hidden">
									<Image
										src={cat.image}
										alt={cat.title}
										fill
										sizes="(max-width:768px) 100vw, 33vw"
										className="object-cover transition-transform duration-700 hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/10" />
								</div>

								<div className="p-5 sm:p-6 relative">
									<p className="text-[10px] sm:text-xs tracking-[0.35em] text-neutral-400 uppercase mb-1">{cat.subtitle}</p>
									<div className="flex items-center justify-between">
										<h3 className="font-serif text-xl sm:text-2xl tracking-wide text-[#1A1A1A] font-semibold">{cat.title}</h3>
										<span className="text-neutral-400 text-lg">▾</span>
									</div>
								</div>

								<div className="overflow-hidden bg-white/50">
									<ul className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
										<li className="border-t border-neutral-100 mb-2" />
										{cat.items.map((item: any) => (
											<li key={item.id} className="flex items-center justify-between gap-2 py-1">
												<span className="text-sm text-neutral-800 font-medium whitespace-nowrap">{item.name}</span>
												<span className="flex-1 mx-2 border-b border-dotted border-neutral-200 min-w-4" />
												<span className="text-sm text-neutral-500 tabular-nums whitespace-nowrap">₹{Number(item.price)}</span>
												<AddToCartButton item={item} categoryImage={cat.image} />
											</li>
										))}
									</ul>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
