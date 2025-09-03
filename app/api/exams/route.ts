import { type NextRequest, NextResponse } from "next/server"
import { getEpisode } from "@/lib/data/courses"

type Attempt = {
  id: number
  userId: number
  courseId: number
  episodeId: number
  score: number
  passed: boolean
  createdAt: string
}

const attempts: Attempt[] = []
let attemptCounter = 1

// GET /api/exams?courseId=1&episodeId=11 -> returns sanitized quiz (no correct answers)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = Number.parseInt(String(searchParams.get("courseId") || "0"))
  const episodeId = Number.parseInt(String(searchParams.get("episodeId") || "0"))

  if (!courseId || !episodeId) {
    return NextResponse.json({ error: "courseId and episodeId are required" }, { status: 400 })
  }

  const episode = getEpisode(courseId, episodeId)
  if (!episode) return NextResponse.json({ error: "Episode not found" }, { status: 404 })

  const quiz = episode.quiz
  const sanitized = {
    id: quiz.id,
    title: quiz.title,
    timeLimit: quiz.timeLimit,
    passingScore: quiz.passingScore,
    courseId,
    episodeId,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
    })),
  }

  return NextResponse.json({ success: true, data: sanitized })
}

// POST submit episode quiz
// body: { action: "submit_episode", userId, courseId, episodeId, answers: number[] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body as { action: string }

    if (action !== "submit_episode") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const userId = Number.parseInt(String(body.userId || "0"))
    const courseId = Number.parseInt(String(body.courseId || "0"))
    const episodeId = Number.parseInt(String(body.episodeId || "0"))
    const answers = (body.answers || []) as number[]

    if (!userId || !courseId || !episodeId || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const episode = getEpisode(courseId, episodeId)
    if (!episode) return NextResponse.json({ error: "Episode not found" }, { status: 404 })

    const quiz = episode.quiz
    const total = quiz.questions.length
    let correct = 0
    for (let i = 0; i < total; i++) {
      if (answers[i] === quiz.questions[i].correctAnswer) correct++
    }
    const score = Math.round((correct / total) * 100)
    const passed = score >= quiz.passingScore

    const attempt: Attempt = {
      id: attemptCounter++,
      userId,
      courseId,
      episodeId,
      score,
      passed,
      createdAt: new Date().toISOString(),
    }
    attempts.push(attempt)

    // Award basic coins for pass (optional flow hook)
    const coinsAwarded = passed ? 20 : 5

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        score,
        passed,
        correct,
        total,
        coinsAwarded,
        message: passed ? "Great job! You passed the episode quiz." : "Keep practicing. You can retake this quiz.",
      },
    })
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
