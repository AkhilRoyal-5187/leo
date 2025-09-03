"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Quiz = {
  id: number
  title: string
  timeLimit: number
  passingScore: number
  courseId: number
  episodeId: number
  questions: { id: number; text: string; options: string[] }[]
}

export default function EpisodeTestPage() {
  const params = useParams<{ id: string; videoId: string }>()
  const router = useRouter()
  const courseId = Number.parseInt(String(params?.id || "0"))
  const episodeId = Number.parseInt(String(params?.videoId || "0"))
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<null | {
    score: number
    passed: boolean
    correct: number
    total: number
    coinsAwarded: number
    message: string
  }>(null)

  useEffect(() => {
    if (!courseId || !episodeId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/exams?courseId=${courseId}&episodeId=${episodeId}`, { cache: "no-store" })
        const json = await res.json()
        if (json?.success) setQuiz(json.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId, episodeId])

  const orderedQuestions = useMemo(() => quiz?.questions || [], [quiz])

  const handleSubmit = async () => {
    if (!quiz) return
    setSubmitting(true)
    try {
      const out = orderedQuestions.map((q) => (typeof answers[q.id] === "number" ? answers[q.id] : -1))
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_episode",
          userId: 1,
          courseId,
          episodeId,
          answers: out,
        }),
      })
      const json = await res.json()
      if (json?.success) {
        setResult(json.data)
      } else {
        alert(json?.error || "Failed to submit")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <p className="mb-3">Quiz not found.</p>
        <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
          Back to Course
        </Button>
      </div>
    )
  }

  if (result) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">{quiz.title}</h1>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={result.passed ? "default" : "secondary"}>{result.passed ? "Passed" : "Try Again"}</Badge>
              <span className="text-sm text-muted-foreground">{result.message}</span>
            </div>
            <p className="text-sm">
              Score: <span className="font-medium">{result.score}%</span> ({result.correct}/{result.total} correct)
            </p>
            <p className="text-sm mt-1">Coins Awarded: {result.coinsAwarded}</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/courses/${courseId}`}>
                <Button>Back to Course</Button>
              </Link>
              {!result.passed && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null)
                    setAnswers({})
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">{quiz.title}</h1>
        <div className="text-sm text-muted-foreground">
          Pass {quiz.passingScore}% • {quiz.timeLimit} mins • {quiz.questions.length} questions
        </div>
      </div>
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="space-y-6">
            {orderedQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium">
                  {idx + 1}. {q.text}
                </p>
                <RadioGroup
                  value={typeof answers[q.id] === "number" ? String(answers[q.id]) : undefined}
                  onValueChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: Number(val) }))}
                >
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center space-x-2">
                      <RadioGroupItem id={`q${q.id}-o${oi}`} value={String(oi)} />
                      <Label htmlFor={`q${q.id}-o${oi}`} className="cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Answers"}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
