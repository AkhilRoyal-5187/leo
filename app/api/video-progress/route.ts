import { type NextRequest, NextResponse } from "next/server"

// Mock database for video progress tracking
const videoProgressData = {
  progress: [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      videoId: 1,
      watchedDuration: 1800, // seconds
      totalDuration: 2700, // 45 minutes
      completed: false,
      lastWatchedAt: "2024-01-15T10:30:00Z",
      watchSessions: [
        {
          sessionId: 1,
          startTime: "2024-01-15T10:00:00Z",
          endTime: "2024-01-15T10:30:00Z",
          watchedDuration: 1800,
        },
      ],
    },
  ],
  videoAnalytics: [
    {
      videoId: 1,
      totalViews: 245,
      averageWatchTime: 2100,
      completionRate: 78,
      dropOffPoints: [300, 900, 1500], // seconds where users commonly drop off
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const courseId = searchParams.get("courseId")
  const videoId = searchParams.get("videoId")

  if (videoId && userId) {
    const progress = videoProgressData.progress.find(
      (p) => p.userId === Number.parseInt(userId) && p.videoId === Number.parseInt(videoId),
    )

    return NextResponse.json({
      success: true,
      data: progress || {
        watchedDuration: 0,
        totalDuration: 0,
        completed: false,
        lastWatchedAt: null,
      },
    })
  }

  if (courseId && userId) {
    const courseProgress = videoProgressData.progress.filter(
      (p) => p.userId === Number.parseInt(userId) && p.courseId === Number.parseInt(courseId),
    )

    return NextResponse.json({
      success: true,
      data: courseProgress,
    })
  }

  return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, courseId, videoId, watchedDuration, totalDuration, currentTime } = body

    if (action === "update_progress") {
      let progress = videoProgressData.progress.find(
        (p) => p.userId === Number.parseInt(userId) && p.videoId === Number.parseInt(videoId),
      )

      if (!progress) {
        progress = {
          id: videoProgressData.progress.length + 1,
          userId: Number.parseInt(userId),
          courseId: Number.parseInt(courseId),
          videoId: Number.parseInt(videoId),
          watchedDuration: 0,
          totalDuration: Number.parseInt(totalDuration),
          completed: false,
          lastWatchedAt: new Date().toISOString(),
          watchSessions: [],
        }
        videoProgressData.progress.push(progress)
      }

      // Update progress
      progress.watchedDuration = Math.max(progress.watchedDuration, Number.parseInt(watchedDuration))
      progress.lastWatchedAt = new Date().toISOString()
      progress.completed = progress.watchedDuration >= progress.totalDuration * 0.9 // 90% completion

      // Add watch session
      const currentSession = progress.watchSessions[progress.watchSessions.length - 1]
      if (!currentSession || new Date().getTime() - new Date(currentSession.endTime).getTime() > 300000) {
        // New session if more than 5 minutes gap
        progress.watchSessions.push({
          sessionId: progress.watchSessions.length + 1,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          watchedDuration: Number.parseInt(watchedDuration),
        })
      } else {
        // Update current session
        currentSession.endTime = new Date().toISOString()
        currentSession.watchedDuration = Number.parseInt(watchedDuration)
      }

      // Award coins if video completed for first time
      let coinsAwarded = 0
      if (progress.completed && progress.watchSessions.length === 1) {
        coinsAwarded = 25 // Award 25 coins for video completion
      }

      return NextResponse.json({
        success: true,
        data: {
          progress,
          coinsAwarded,
          message: progress.completed ? "Video completed! Coins awarded." : "Progress saved",
        },
      })
    }

    if (action === "mark_completed") {
      const progress = videoProgressData.progress.find(
        (p) => p.userId === Number.parseInt(userId) && p.videoId === Number.parseInt(videoId),
      )

      if (!progress) {
        return NextResponse.json({ error: "Progress not found" }, { status: 404 })
      }

      const wasCompleted = progress.completed
      progress.completed = true
      progress.watchedDuration = progress.totalDuration

      const coinsAwarded = wasCompleted ? 0 : 25

      return NextResponse.json({
        success: true,
        data: {
          progress,
          coinsAwarded,
          message: "Video marked as completed!",
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
