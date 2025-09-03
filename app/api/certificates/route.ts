import { type NextRequest, NextResponse } from "next/server"

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

const certDB: { certs: Certificate[] } = {
  certs: [],
}

function randomCode(len = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function toGrade(score: number): Certificate["grade"] {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 60) return "C"
  return "D"
}

async function hasPassedExam(userId: number, courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/exams?userId=${userId}&courseId=${courseId}&status=passed`,
  )
  const json = await res.json()
  return Boolean(json?.data?.length)
}

async function hasCompletedVideos(userId: number, courseId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/video-progress?userId=${userId}&courseId=${courseId}`,
  )
  const json = await res.json()
  const progressList = (json?.data || []) as any[]
  if (!progressList.length) return false
  // consider completed if all tracked videos have completed flag
  return progressList.every((p) => p.completed)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const code = searchParams.get("code")
  const userId = searchParams.get("userId")
  const courseId = searchParams.get("courseId")

  if (id) {
    const cert = certDB.certs.find((c) => c.id === Number.parseInt(id))
    if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: cert })
  }

  if (code) {
    const cert = certDB.certs.find((c) => c.code === code)
    if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: cert })
  }

  // list for user/course
  let certs = certDB.certs
  if (userId) certs = certs.filter((c) => c.userId === Number.parseInt(userId))
  if (courseId) certs = certs.filter((c) => c.courseId === Number.parseInt(courseId))

  return NextResponse.json({ success: true, data: certs })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body as { action: string }

    if (action === "issue") {
      const { userId, courseId, userName } = body as { userId: number; courseId: number; userName: string }
      if (!userId || !courseId || !userName) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Avoid duplicate certificate
      const existing = certDB.certs.find((c) => c.userId === userId && c.courseId === courseId)
      if (existing) {
        return NextResponse.json({ success: true, data: existing, message: "Certificate already issued" })
      }

      // Fetch course info
      const courseRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/courses?courseId=${courseId}`)
      const courseJson = await courseRes.json()
      if (!courseJson?.success) return NextResponse.json({ error: "Course not found" }, { status: 404 })
      const course = courseJson.data

      // Eligibility: passed at least one exam for course AND completed videos
      const passed = await hasPassedExam(userId, courseId)
      const videosDone = await hasCompletedVideos(userId, courseId)

      if (!passed || !videosDone) {
        return NextResponse.json(
          {
            error:
              "Eligibility not met. Please complete course videos and pass the exam before requesting a certificate.",
            details: { passed, videosDone },
          },
          { status: 400 },
        )
      }

      // Determine best score from passed attempts
      const attemptsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/exams?userId=${userId}&courseId=${courseId}&status=passed`,
      )
      const attemptsJson = await attemptsRes.json()
      const bestScore = Math.max(...attemptsJson.data.map((a: any) => a.score || 0))

      const cert: Certificate = {
        id: certDB.certs.length + 1,
        code: randomCode(10),
        userId,
        userName,
        courseId,
        courseTitle: course.title,
        score: bestScore,
        grade: toGrade(bestScore),
        issuedAt: new Date().toISOString(),
        url: `/certificates/${certDB.certs.length + 1}`,
      }

      certDB.certs.push(cert)
      return NextResponse.json({ success: true, data: cert })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
