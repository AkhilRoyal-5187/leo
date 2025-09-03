import { cookies } from "next/headers"
import { storeProducts, type StoreProduct } from "@/lib/data/store-products"

type CartMap = Map<string, number> // productId -> qty

export type CartItem = {
  productId: string
  name: string
  image: string
  unitPrice: number
  qty: number
  lineTotal: number
}

export type CartDetails = {
  items: CartItem[]
  count: number
  subtotal: number
  total: number
}

export type Order = {
  id: string
  sid: string
  createdAt: number
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  customer: { name: string; phone: string; email?: string }
  address: { line1: string; line2?: string; city: string; pincode: string }
  method: "standard" | "express"
  etaMs: number
}

declare global {
  // eslint-disable-next-line no-var
  var __LEO_STORE_MEM__:
    | {
        carts: Map<string, CartMap>
        orders: Map<string, Order>
      }
    | undefined
}

function mem() {
  if (!global.__LEO_STORE_MEM__) {
    global.__LEO_STORE_MEM__ = { carts: new Map<string, CartMap>(), orders: new Map<string, Order>() }
  }
  return global.__LEO_STORE_MEM__
}

function uuid(): string {
  // @ts-ignore
  return global.crypto?.randomUUID?.() || "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getOrCreateSession(): string {
  const jar = cookies()
  let sid = jar.get("leo_sid")?.value
  if (!sid) {
    sid = uuid()
    jar.set("leo_sid", sid, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" })
  }
  return sid
}

export function listProducts() {
  return storeProducts
}

export function findProductById(id: string): StoreProduct | undefined {
  return storeProducts.find((p) => p.id === id)
}

function priceAfterDiscount(p: StoreProduct) {
  return Math.round(p.price * (1 - (p.discount ?? 0) / 100))
}

function toDetails(state: CartMap): CartDetails {
  let subtotal = 0
  const items: CartItem[] = []
  state.forEach((qty, productId) => {
    const p = findProductById(productId)
    if (!p) return
    const unit = priceAfterDiscount(p)
    const line = unit * qty
    subtotal += line
    items.push({ productId, name: p.name, image: p.image, unitPrice: unit, qty, lineTotal: line })
  })
  const count = items.reduce((s, i) => s + i.qty, 0)
  return { items, count, subtotal, total: subtotal }
}

export function getCart(sid: string): CartDetails {
  const { carts } = mem()
  const state = carts.get(sid) ?? new Map<string, number>()
  return toDetails(state)
}

export function addToCart(sid: string, productId: string, qty = 1): CartDetails {
  const { carts } = mem()
  const p = findProductById(productId)
  if (!p) return getCart(sid)
  const state = carts.get(sid) ?? new Map<string, number>()
  const nextQty = Math.max(1, (state.get(productId) ?? 0) + Math.max(1, Math.floor(qty)))
  state.set(productId, nextQty)
  carts.set(sid, state)
  return toDetails(state)
}

export function updateQty(sid: string, productId: string, qty: number): CartDetails {
  const { carts } = mem()
  const state = carts.get(sid) ?? new Map<string, number>()
  if (qty <= 0) state.delete(productId)
  else state.set(productId, Math.floor(qty))
  carts.set(sid, state)
  return toDetails(state)
}

export function removeFromCart(sid: string, productId: string): CartDetails {
  const { carts } = mem()
  const state = carts.get(sid) ?? new Map<string, number>()
  state.delete(productId)
  carts.set(sid, state)
  return toDetails(state)
}

export function clearCart(sid: string): CartDetails {
  const { carts } = mem()
  carts.set(sid, new Map())
  return toDetails(new Map())
}

export function createOrder(
  sid: string,
  payload: {
    customer: { name: string; phone: string; email?: string }
    address: { line1: string; line2?: string; city: string; pincode: string }
    method: "standard" | "express"
  },
): Order | null {
  const { carts, orders } = mem()
  const state = carts.get(sid) ?? new Map<string, number>()
  const details = toDetails(state)
  if (details.items.length === 0) return null

  const deliveryFee = details.subtotal > 1500 ? 0 : payload.method === "express" ? 199 : 79
  const total = details.subtotal + deliveryFee
  const id = "ORD-" + uuid().slice(-8).toUpperCase()
  const etaMs = payload.method === "express" ? 60 * 1000 : 120 * 1000 // demo ETA: 1 or 2 minutes

  const order: Order = {
    id,
    sid,
    createdAt: Date.now(),
    items: details.items,
    subtotal: details.subtotal,
    deliveryFee,
    total,
    customer: payload.customer,
    address: payload.address,
    method: payload.method,
    etaMs,
  }

  orders.set(id, order)
  carts.set(sid, new Map()) // clear cart after order
  return order
}

export function listOrdersForSession(sid: string): Order[] {
  const { orders } = mem()
  return Array.from(orders.values())
    .filter((o) => o.sid === sid)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function getOrderProgress(id: string) {
  const { orders } = mem()
  const o = orders.get(id)
  if (!o) return null
  const elapsed = Date.now() - o.createdAt
  const progress = Math.max(0, Math.min(100, Math.round((elapsed / o.etaMs) * 100)))
  const status =
    progress >= 100 ? "delivered" : progress >= 75 ? "out_for_delivery" : progress >= 40 ? "in_transit" : "packed"
  const checkpoints = [
    { key: "packed", label: "Packed", reached: progress >= 10 },
    { key: "in_transit", label: "In Transit", reached: progress >= 40 },
    { key: "out_for_delivery", label: "Out for Delivery", reached: progress >= 75 },
    { key: "delivered", label: "Delivered", reached: progress >= 100 },
  ]
  return { order: o, progress, status, checkpoints }
}
