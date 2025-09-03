"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"

type CartItem = {
  productId: string
  name: string
  image: string
  unitPrice: number
  qty: number
  lineTotal: number
}
type CartDetails = { items: CartItem[]; count: number; subtotal: number; total: number }

async function safeJson(res: Response) {
  if (!res.ok) throw new Error("Request failed")
  const data = await res.json().catch(() => ({}))
  if (data?.ok === false) throw new Error(data?.error || "Error")
  return data
}

export default function CartPage() {
  const [cart, setCart] = useState<CartDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [method, setMethod] = useState<"standard" | "express">("standard")
  const router = useRouter()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("leo_checkout") || "{}")
    setName(saved.name || "")
    setPhone(saved.phone || "")
    setEmail(saved.email || "")
    setLine1(saved.line1 || "")
    setCity(saved.city || "")
    setPincode(saved.pincode || "")
    setMethod(saved.method === "express" ? "express" : "standard")
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" })
        const data = await safeJson(res)
        if (active) setCart(data.cart || { items: [], count: 0, subtotal: 0, total: 0 })
      } catch (e: any) {
        setMsg(e?.message || "Failed to load cart")
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const deliveryFee = useMemo(() => {
    const sub = cart?.subtotal || 0
    if (sub > 1500) return 0
    return method === "express" ? 199 : 79
  }, [cart?.subtotal, method])

  const grandTotal = useMemo(() => (cart?.subtotal || 0) + deliveryFee, [cart?.subtotal, deliveryFee])

  async function update(productId: string, qty: number) {
    setMsg(null)
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      })
      const data = await safeJson(res)
      setCart(data.cart)
    } catch (e: any) {
      setMsg(e?.message || "Failed to update item")
    }
  }

  async function remove(productId: string) {
    setMsg(null)
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      const data = await safeJson(res)
      setCart(data.cart)
    } catch (e: any) {
      setMsg(e?.message || "Failed to remove item")
    }
  }

  async function clearAll() {
    setMsg(null)
    try {
      const res = await fetch("/api/cart?clear=true", { method: "DELETE" })
      const data = await safeJson(res)
      setCart(data.cart)
    } catch (e: any) {
      setMsg(e?.message || "Failed to clear cart")
    }
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const payload = {
        customer: { name, phone, email },
        address: { line1, city, pincode },
        method,
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await safeJson(res)
      localStorage.setItem("leo_checkout", JSON.stringify({ name, phone, email, line1, city, pincode, method }))
      if (data?.id) {
        router.push(`/orders/${encodeURIComponent(data.id)}`)
      } else {
        setMsg("Failed to create order")
      }
    } catch (e: any) {
      setMsg(e?.message || "Checkout failed")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="sticky top-0 z-10 border-b bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-500 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <ShoppingCart className="h-5 w-5" />
            {"Your Cart"}
          </h1>
          <a href="/store" className="text-sm underline">
            {"Continue Shopping"}
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {msg && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">{msg}</div>
          )}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : cart && cart.items.length > 0 ? (
            <>
              {cart.items.map((it) => (
                <Card key={it.productId} className="overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={it.image || "/placeholder.svg?height=80&width=80&query=cart%20item"}
                        alt={it.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-600">
                        {it.unitPrice} {"LEO"} {" x "} {it.qty} {" = "}
                        <span className="font-medium text-gray-900">
                          {it.lineTotal} {"LEO"}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center rounded-md border px-1">
                        <button
                          aria-label="Decrease"
                          className="p-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          onClick={() => update(it.productId, Math.max(0, it.qty - 1))}
                          disabled={it.qty <= 1}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-sm">{it.qty}</span>
                        <button
                          aria-label="Increase"
                          className="p-2 text-gray-700 hover:text-gray-900"
                          onClick={() => update(it.productId, it.qty + 1)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => remove(it.productId)}
                      type="button"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {"Remove"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearAll} className="border-gray-300 bg-transparent" type="button">
                  {"Clear Cart"}
                </Button>
                <a className="text-sm underline" href="/store">
                  {"Add more items"}
                </a>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{"Your cart is empty"}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <a href="/store">{"Browse Store"}</a>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <form onSubmit={checkout} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{"Checkout"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="name">{"Full Name"}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">{"Phone"}</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">{"Email (optional)"}</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="line1">{"Address Line"}</Label>
                  <Input id="line1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">{"City"}</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="pincode">{"Pincode"}</Label>
                    <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="method">{"Delivery Method"}</Label>
                  <select
                    id="method"
                    className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
                    value={method}
                    onChange={(e) => setMethod(e.target.value === "express" ? "express" : "standard")}
                  >
                    <option value="standard">{"Standard (79 LEO)"}</option>
                    <option value="express">{"Express (199 LEO)"}</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-600">
                    {cart && cart.subtotal > 1500
                      ? "You have free delivery!"
                      : "Orders above 1500 LEO get free delivery."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{"Order Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{"Subtotal"}</span>
                <span>
                  {cart?.subtotal ?? 0} {"LEO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{"Delivery"}</span>
                <span>
                  {deliveryFee} {"LEO"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <span>{"Total"}</span>
                <span>
                  {grandTotal} {"LEO"}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                type="submit"
                disabled={!cart || cart.items.length === 0}
              >
                {"Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </main>
  )
}
