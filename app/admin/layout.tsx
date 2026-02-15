import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Server-side auth check using Supabase server client
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/auth/login")
    }

    const ADMIN_EMAILS = ["ayushsinghe07@gmail.com"]
    if (!ADMIN_EMAILS.includes(user.email || "")) {
      redirect("/")
    }
  } catch (e) {
    // If auth check fails, redirect to login
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">Dashboard</a>
          <a href="/admin/menu" className="block px-4 py-2 rounded hover:bg-gray-100">Manage Menu</a>
          <a href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-100">Orders</a>
          <a href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-100">Users</a>
        </nav>

      </aside>

      {/* Main content */}
      <main className="flex-1">

        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Admin Dashboard</h1>
          <div>
            <form action="/auth/logout" method="post">
              <button type="submit" className="px-4 py-2 bg-black text-white rounded">Logout</button>
            </form>
          </div>
        </header>

        {/* Content area */}
        <div className="p-6">{children}</div>

      </main>

    </div>
  )
}
