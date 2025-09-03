import { NextResponse } from "next/server"
import { addToCart, clearCart, getCart, getOrCreateSession, removeFromCart, updateQty } from "@/app/api/_lib/cart-db"

export async function GET() {
  try {
    const sid = getOrCreateSession()
    const cart = getCart(sid)
    return NextResponse.json({ ok: true, cart })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to load cart" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { productId, qty } = await req.json().catch(() => ({}))
    if (!productId) return NextResponse.json({ ok: false, error: "Missing productId" }, { status: 400 })
    const sid = getOrCreateSession()
    const cart = addToCart(sid, String(productId), Number.isFinite(qty) ? Number(qty) : 1)
    return NextResponse.json({ ok: true, cart })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { productId, qty } = await req.json().catch(() => ({}))
    if (!productId || typeof qty !== "number")
      return NextResponse.json({ ok: false, error: "Missing productId/qty" }, { status: 400 })
    const sid = getOrCreateSession()
    const cart = updateQty(sid, String(productId), Math.floor(qty))
    return NextResponse.json({ ok: true, cart })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to update quantity" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const sid = getOrCreateSession()
    const url = new URL(req.url)
    const clear = url.searchParams.get("clear")
    if (clear === "true") {
      const cart = clearCart(sid)
      return NextResponse.json({ ok: true, cart })
    }
    const { productId } = await req.json().catch(() => ({}))
    if (!productId) return NextResponse.json({ ok: false, error: "Missing productId" }, { status: 400 })
    const cart = removeFromCart(sid, String(productId))
    return NextResponse.json({ ok: true, cart })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to remove item" }, { status: 500 })
  }
}
