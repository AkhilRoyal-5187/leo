import { type NextRequest, NextResponse } from "next/server"
import { coursesDB, getCourse } from "@/lib/data/courses"

type Question = {
  id: number
  text: string
  options: string[]
  correctAnswer: number // index
}

type Exam = {
  id: number
  title: string
  timeLimit: number // minutes
  passingScore: number // percentage
  coins: number
  questions: Question[]
}

type Episode = {
  id: number
  title: string
  durationSeconds: number
  videoUrl: string
}

type Course = {
  id: number
  title: string
  category: string
  thumbnail: string
  description: string
  teacher: {
    id: number
    name: string
    avatar?: string
    bio?: string
  }
  episodes: Episode[]
  examinations: Exam[]
}

function generateFinalQuestions(seed: number, count = 20): Question[] {
  const questions: Question[] = []
  for (let i = 1; i <= count; i++) {
    // Simple, deterministic math questions for demo purposes
    const a = ((seed * i) % 12) + 3
    const b = ((seed + i * 2) % 11) + 2
    const correct = a + b
    const options = [String(correct), String(correct + 1), String(correct - 1), String(correct + 2)]
    questions.push({
      id: i,
      text: `Q${i}. What is ${a} + ${b}?`,
      options,
      correctAnswer: 0,
    })
  }
  return questions
}

// GET /api/courses
// - ?courseId=1 -> single course with episodes and per-episode quizzes (quiz answers are not stripped here; UI should use /api/exams to fetch sanitized quiz)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")
  const category = searchParams.get("category")
  const q = searchParams.get("q")

  if (courseId) {
    const course = getCourse(Number.parseInt(courseId))
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: course })
  }

  let list = coursesDB
  if (category && category.toLowerCase() !== "all") {
    list = list.filter((c) => c.category.toLowerCase() === category.toLowerCase())
  }
  if (q) {
    const needle = q.toLowerCase()
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(needle) ||
        c.description.toLowerCase().includes(needle) ||
        c.category.toLowerCase().includes(needle),
    )
  }

  // Lightweight list response (strip quizzes)
  const summarized = list.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    description: c.description,
    thumbnail: c.thumbnail,
    teacher: c.teacher,
    episodesCount: c.episodes.length,
  }))

  return NextResponse.json({ success: true, data: summarized })
}
