import { NextResponse } from "next/server"
import { createOrder, getOrCreateSession, listOrdersForSession } from "@/app/api/_lib/cart-db"

export async function GET() {
  try {
    const sid = getOrCreateSession()
    const orders = listOrdersForSession(sid)
    return NextResponse.json({ ok: true, orders })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to list orders" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { customer, address, method } = body || {}
    if (!customer?.name || !customer?.phone || !address?.line1 || !address?.city || !address?.pincode) {
      return NextResponse.json({ ok: false, error: "Missing required checkout fields" }, { status: 400 })
    }
    if (method !== "standard" && method !== "express") {
      return NextResponse.json({ ok: false, error: "Invalid delivery method" }, { status: 400 })
    }
    const sid = getOrCreateSession()
    const order = createOrder(sid, { customer, address, method })
    if (!order) return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 })
    return NextResponse.json({ ok: true, id: order.id, order })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to create order" }, { status: 500 })
  }
}
