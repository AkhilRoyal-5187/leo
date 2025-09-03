"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react"

type Checkpoint = { key: string; label: string; reached: boolean }
type Order = {
  id: string
  createdAt: number
  subtotal: number
  deliveryFee: number
  total: number
  method: "standard" | "express"
  etaMs: number
  customer: { name: string; phone: string; email?: string }
  address: { line1: string; line2?: string; city: string; pincode: string }
  items: Array<{ name: string; qty: number; unitPrice: number; lineTotal: number }>
}

async function safeJson(res: Response) {
  if (!res.ok) throw new Error("Request failed")
  const data = await res.json().catch(() => ({}))
  if (data?.ok === false) throw new Error(data?.error || "Error")
  return data
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [status, setStatus] = useState<"packed" | "in_transit" | "out_for_delivery" | "delivered">("packed")
  const [progress, setProgress] = useState(0)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: any
    let active = true
    async function tick() {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(String(id))}`, { cache: "no-store" })
        const data = await safeJson(res)
        if (!active) return
        setOrder(data.order)
        setProgress(data.progress)
        setStatus(data.status)
        setCheckpoints(data.checkpoints)
        if (data.status === "delivered") {
          clearInterval(timer)
        }
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to fetch status")
      }
    }
    if (id) {
      tick()
      timer = setInterval(tick, 2000)
    }
    return () => {
      active = false
      if (timer) clearInterval(timer)
    }
  }, [id])

  const statusIcon = useMemo(() => {
    if (status === "delivered") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    if (status === "out_for_delivery") return <Truck className="h-5 w-5 text-emerald-600" />
    return <Package className="h-5 w-5 text-emerald-600" />
  }, [status])

  return (
    <main className="min-h-screen bg-white">
      <section className="sticky top-0 z-10 border-b bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold">
            {"Tracking "} {String(id)}
          </h1>
          <Button asChild variant="secondary">
            <Link href="/orders">{"All Orders"}</Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {statusIcon}
              <span className="capitalize">{status.replaceAll("_", " ")}</span>
              <span className="ml-auto text-sm text-gray-600">
                {progress} {"%"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {checkpoints.map((c) => (
                <div
                  key={c.key}
                  className={`rounded-md border p-3 text-center text-sm ${
                    c.reached ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {order && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{"Delivery"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-700" />
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-gray-700">{order.address.line1}</div>
                    <div className="text-gray-700">
                      {order.address.city} {" - "} {order.address.pincode}
                    </div>
                    <div className="text-gray-600">{order.customer.phone}</div>
                    {order.customer.email ? <div className="text-gray-600">{order.customer.email}</div> : null}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {"Method: "}
                  <span className="font-medium">{order.method === "express" ? "Express" : "Standard"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{"Summary"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{"Subtotal"}</span>
                  <span>
                    {order.subtotal} {"LEO"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{"Delivery"}</span>
                  <span>
                    {order.deliveryFee} {"LEO"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>{"Total"}</span>
                  <span>
                    {order.total} {"LEO"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
