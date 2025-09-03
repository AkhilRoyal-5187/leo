"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Sparkles } from "lucide-react"

type Product = {
  id: string
  name: string
  image: string
  price: number
  discount?: number
  category?: string
}

async function safeJson(res: Response) {
  if (!res.ok) throw new Error("Request failed")
  const data = await res.json().catch(() => ({}))
  if (data?.ok === false) throw new Error(data?.error || "Error")
  return data
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [category, setCategory] = useState<string>("all")

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/store/products", { cache: "no-store" })
        const data = await safeJson(res)
        if (active) setProducts(data.products || [])
      } catch (e: any) {
        setMessage(e?.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => {
    const cats = new Set<string>(["all"])
    products.forEach((p) => p.category && cats.add(p.category))
    return Array.from(cats)
  }, [products])

  const visible = useMemo(
    () => products.filter((p) => (category === "all" ? true : p.category === category)),
    [products, category],
  )

  async function add(pid: string) {
    setMessage(null)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: pid, qty: 1 }),
      })
      await safeJson(res)
      setMessage("Added to cart")
    } catch (e: any) {
      setMessage(e?.message || "Failed to add")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="sticky top-0 z-10 border-b bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-500 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-5 w-5" />
            {"LEO Store"}
          </h1>
          <div className="flex items-center gap-3">
            <label className="text-sm opacity-90" htmlFor="category">
              {"Category"}
            </label>
            <select
              id="category"
              className="rounded-md border border-white/30 bg-white/20 px-3 py-1 text-sm text-white backdrop-blur outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <a
              href="/cart"
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25"
            >
              <ShoppingCart className="h-4 w-4" />
              {"Cart"}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {message && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {message}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => {
              const discounted = p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price
              return (
                <Card key={p.id} className="overflow-hidden border-gray-200 shadow-sm transition hover:shadow-md">
                  <CardHeader className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src={p.image || "/placeholder.svg?height=160&width=320&query=product%20image"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      {p.discount ? (
                        <Badge className="absolute left-2 top-2 bg-emerald-600 hover:bg-emerald-600">
                          {"-" + p.discount + "%"}
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4">
                    <CardTitle className="line-clamp-2 text-base">{p.name}</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {discounted} {"LEO"}
                      </span>
                      {p.discount ? (
                        <span className="text-sm text-gray-500 line-through">
                          {p.price} {"LEO"}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => add(p.id)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {"Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
