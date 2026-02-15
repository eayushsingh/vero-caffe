import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const id = body.id
		const price = Number(body.price)

		if (!id || isNaN(price)) {
			return NextResponse.json(
				{ error: "Invalid id or price" },
				{ status: 400 }
			)
		}

		const { error } = await supabaseServer
			.from("menu_items")
			.update({ price })
			.eq("id", id)

		if (error) {
			console.error(error)
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true })

	} catch (err) {
		console.error(err)
		return NextResponse.json(
			{ error: "Server error" },
			{ status: 500 }
		)
	}
}
