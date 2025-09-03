import { NextResponse } from "next/server"
import { getOrderProgress } from "@/app/api/_lib/cart-db"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id
    const progress = getOrderProgress(id)
    if (!progress) return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 })
    return NextResponse.json({ ok: true, ...progress })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to get order status" }, { status: 500 })
  }
}
