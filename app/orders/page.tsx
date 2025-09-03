"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, Clock } from "lucide-react"

type Order = {
  id: string
  createdAt: number
  subtotal: number
  deliveryFee: number
  total: number
  method: "standard" | "express"
  etaMs: number
}

async function safeJson(res: Response) {
  if (!res.ok) throw new Error("Request failed")
  const data = await res.json().catch(() => ({}))
  if (data?.ok === false) throw new Error(data?.error || "Error")
  return data
}

function computeStatus(createdAt: number, etaMs: number) {
  const progress = Math.max(0, Math.min(100, Math.round(((Date.now() - createdAt) / etaMs) * 100)))
  const status =
    progress >= 100 ? "delivered" : progress >= 75 ? "out_for_delivery" : progress >= 40 ? "in_transit" : "packed"
  return { progress, status }
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" })
        const data = await safeJson(res)
        if (active) setOrders((data.orders || []) as Order[])
      } finally {
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      )
    }
    if (orders.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{"No orders yet"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/store">{"Go to Store"}</Link>
            </Button>
          </CardContent>
        </Card>
      )
    }
    return (
      <div className="space-y-4">
        {orders.map((o) => {
          const { status, progress } = computeStatus(o.createdAt, o.etaMs)
          const Icon = status === "delivered" ? CheckCircle2 : status === "out_for_delivery" ? Truck : Package
          return (
            <Card key={o.id} className="border-gray-200">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="font-medium">
                      {"Order "} {o.id}
                    </div>
                    <div className="text-xs text-gray-600">
                      {"Total: "} {o.total} {" LEO"} {" • "} {o.method === "express" ? "Express" : "Standard"}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {"Status: "}
                        <span className="font-medium">{status.replaceAll("_", " ")}</span>
                        {" • "}
                        {progress} {"%"}
                      </span>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/orders/${encodeURIComponent(o.id)}`}>{"Track"}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }, [loading, orders])

  return (
    <main className="min-h-screen bg-white">
      <section className="sticky top-0 z-10 border-b bg-gradient-to-r from-orange-600 via-pink-600 to-violet-600 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">{"Your Orders"}</h1>
          <Link href="/store" className="text-sm underline">
            {"Continue Shopping"}
          </Link>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-6">{content}</div>
    </main>
  )
}
