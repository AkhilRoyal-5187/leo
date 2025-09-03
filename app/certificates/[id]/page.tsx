"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Certificate = {
  id: number
  code: string
  userId: number
  userName: string
  courseId: number
  courseTitle: string
  score: number
  grade: "A+" | "A" | "B" | "C" | "D"
  issuedAt: string
  url: string
}

export default function CertificatePage() {
  const params = useParams<{ id: string }>()
  const certId = Number.parseInt(String(params?.id || "0"))
  const [cert, setCert] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/certificates?id=${certId}`, { cache: "no-store" })
        const json = await res.json()
        if (!json?.success) throw new Error(json?.error || "Certificate not found")
        setCert(json.data)
      } catch (e: any) {
        setError(e?.message || "Failed to load certificate")
      } finally {
        setLoading(false)
      }
    }
    if (certId) load()
  }, [certId])

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        {loading && <p>Loading certificate...</p>}
        {error && (
          <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
        )}
        {!loading && cert && (
          <>
            <div>
              <h1 className="text-2xl font-bold">Certificate</h1>
              <p className="text-muted-foreground">Verification Code: {cert.code}</p>
            </div>

            <Card className="border shadow-xl">
              <CardContent className="p-6 md:p-10">
                <div className="border-4 border-dashed rounded-2xl p-6 md:p-10 bg-gradient-to-br from-amber-50 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75"></div>
                      <h2 className="relative text-2xl font-extrabold tracking-widest">LEO</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Issued</p>
                      <p className="font-medium">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="text-center space-y-1 mb-6">
                    <p className="uppercase tracking-widest text-xs text-muted-foreground">Certificate of Completion</p>
                    <h3 className="text-xl font-bold">{cert.userName}</h3>
                    <p className="text-sm">
                      has successfully completed the course <span className="font-semibold">{cert.courseTitle}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Score: <span className="font-semibold">{cert.score}%</span> • Grade:{" "}
                      <span className="font-semibold">{cert.grade}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <div className="text-center">
                      <div className="h-12 w-40 mx-auto relative">
                        <Image
                          src="/images/signatures/madhav.png"
                          alt="Signature of Founder P. Madhav Reddy"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-sm">P. Madhav Reddy</p>
                        <p className="text-xs text-muted-foreground">Founder</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-40 mx-auto relative">
                        <Image
                          src="/images/signatures/hareesh.png"
                          alt="Signature of Founder P. Hareesh Teja"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-sm">P. Hareesh Teja</p>
                        <p className="text-xs text-muted-foreground">Founder</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
                    <p>Certificate ID: {cert.id}</p>
                    <p>Verify at /certificates/{cert.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => window.print()} variant="outline">
                Print
              </Button>
              <Button onClick={() => history.back()} variant="outline">
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
