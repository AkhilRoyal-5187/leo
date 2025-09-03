import { NextResponse } from "next/server"
import { listProducts } from "@/app/api/_lib/cart-db"

export async function GET() {
  try {
    const products = listProducts()
    return NextResponse.json({ ok: true, products })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to load products" }, { status: 500 })
  }
}
