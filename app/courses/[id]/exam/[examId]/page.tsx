"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Question = { id: number; text: string; options: string[] }
type Exam = {
  id: number
  title: string
  timeLimit: number
  passingScore: number
  coins: number
  questions: Question[]
}
type Course = {
  id: number
  title: string
  examinations: Exam[]
}

export default function ExamRunnerPage() {
  const params = useParams<{ id: string; examId: string }>()
  const router = useRouter()
  const courseId = Number.parseInt(String(params?.id || "0"))
  const examId = Number.parseInt(String(params?.examId || "0"))

  const [course, setCourse] = useState<Course | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    certId?: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/courses?courseId=${courseId}`, { cache: "no-store" })
        const json = await res.json()
        if (!json?.success) throw new Error(json?.error || "Course not found")
        const c: Course = json.data
        setCourse(c)
        const e = (c.examinations || []).find((x) => x.id === examId) || null
        setExam(e)
        if (e) setAnswers(Array.from({ length: e.questions?.length || 0 }, () => -1))
      } catch (e: any) {
        setError(e?.message || "Failed to load exam")
      }
    }
    if (courseId && examId) load()
  }, [courseId, examId])

  // Start attempt
  useEffect(() => {
    const startAttempt = async () => {
      try {
        const res = await fetch("/api/exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start", userId: 1, courseId, examId }),
        })
        const json = await res.json()
        if (!json?.success) throw new Error(json?.error || "Failed to start exam")
        setAttemptId(json.data.attemptId)
      } catch (e: any) {
        setError(e?.message || "Failed to start exam")
      }
    }
    if (exam && attemptId == null) startAttempt()
  }, [exam, attemptId, courseId, examId])

  const unanswered = useMemo(() => answers.filter((a) => a < 0).length, [answers])

  const submit = async () => {
    if (attemptId == null) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", attemptId, answers }),
      })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.error || "Failed to submit exam")
      const { score, passed } = json.data as { score: number; passed: boolean }

      let certId: number | undefined
      if (passed) {
        // Issue certificate
        const certRes = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "issue", userId: 1, courseId, userName: "Alex Johnson" }),
        })
        const certJson = await certRes.json()
        if (certJson?.success) {
          certId = certJson.data.id
        }
      }

      setResult({ score, passed, certId })
    } catch (e: any) {
      setError(e?.message || "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        {!exam && !error && <p>Loading exam...</p>}
        {error && (
          <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
        )}

        {exam && !result && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">{exam.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {course?.title} • Pass {exam.passingScore}% • {exam.timeLimit} mins
                  </p>
                </div>
                <Badge variant="secondary">{exam.questions?.length || 0} Questions</Badge>
              </div>

              <div className="space-y-6">
                {(exam.questions || []).map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-lg border">
                    <p className="font-medium mb-3">
                      {idx + 1}. {q.text}
                    </p>
                    <div className="grid gap-2">
                      {q.options.map((opt, i) => {
                        const selected = answers[idx] === i
                        return (
                          <button
                            key={i}
                            onClick={() =>
                              setAnswers((prev) => {
                                const next = [...prev]
                                next[idx] = i
                                return next
                              })
                            }
                            className={`text-left p-3 rounded-md border ${
                              selected ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" : "hover:bg-muted"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-4 md:p-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {unanswered > 0 ? `${unanswered} unanswered` : "All questions answered"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  onClick={submit}
                  disabled={submitting || unanswered > 0}
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {result && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <h2 className="text-xl font-bold">{result.passed ? "Congratulations!" : "Result"}</h2>
              <p className="text-muted-foreground">
                Score: <span className="font-semibold">{result.score}%</span>
              </p>
              {result.passed ? (
                <>
                  <p className="text-green-600 dark:text-green-400">You passed the final test.</p>
                  {result.certId ? (
                    <Link href={`/certificates/${result.certId}`}>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                        View Certificate
                      </Button>
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Certificate will be available shortly. Please refresh in a moment.
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-amber-600 dark:text-amber-400">You did not reach the passing score.</p>
                  <Link href={`/courses/${courseId}`}>
                    <Button variant="outline">Back to course</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
