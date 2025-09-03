"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, Clock, VideoIcon, Award } from "lucide-react"

type Episode = {
  id: number
  title: string
  durationSeconds: number
  videoUrl: string
  coins?: number
  quiz: { id: number; title: string; timeLimit: number; passingScore: number; questions: any[] }
}
type Course = {
  id: number
  title: string
  subject: string
  level: string
  category: "academic" | "programming" | "government"
  thumbnail: string
  description: string
  teacher: { id: number; name: string; avatar?: string }
  episodes: Episode[]
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const courseId = Number.parseInt(String(params?.id || "0"))
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!courseId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/courses?courseId=${courseId}`, { cache: "no-store" })
        const json = await res.json()
        if (json?.success) {
          setCourse(json.data)
          setSelected(json.data.episodes?.[0] || null)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId])

  const episodes = useMemo(() => course?.episodes || [], [course])

  const onPlayPause = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const markCompleted = async (ep: Episode) => {
    try {
      await fetch("/api/video-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_progress",
          userId: 1,
          courseId,
          videoId: ep.id,
          watchedDuration: ep.durationSeconds,
          totalDuration: ep.durationSeconds,
        }),
      })
    } catch {
      // no-op
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-6">
        <p className="mb-4">Course not found.</p>
        <Button variant="outline" onClick={() => router.push("/courses")}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="relative h-56 lg:h-full">
            <Image
              src={course.thumbnail || "/placeholder.svg?height=320&width=640&query=course-thumbnail"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-2 p-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{course.level}</Badge>
              <Badge variant="secondary">{course.subject}</Badge>
              <Badge>{course.category}</Badge>
            </div>
            <h1 className="text-2xl font-bold mt-2">{course.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
            <div className="flex items-center gap-3 mt-3 text-sm">
              <Image
                src={course.teacher?.avatar || "/placeholder.svg?height=32&width=32&query=teacher"}
                alt={course.teacher?.name || "Teacher"}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span>{course.teacher?.name}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <Card className="lg:col-span-2 border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-black aspect-video w-full">
              {selected ? (
                <video
                  ref={videoRef}
                  key={selected.id}
                  className="w-full h-full"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => markCompleted(selected)}
                  poster={course.thumbnail}
                >
                  <source src={selected.videoUrl} type="video/mp4" />
                  {"Your browser does not support the video tag."}
                </video>
              ) : (
                <div className="w-full h-full text-white flex items-center justify-center">
                  {"Select an episode to start learning"}
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Now Playing</p>
                <h3 className="font-medium">{selected?.title || "No episode selected"}</h3>
              </div>
              {selected && (
                <div className="flex gap-2">
                  <Button onClick={onPlayPause} className="rounded-full">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Link href={`/courses/${course.id}/episode/${selected.id}/test`}>
                    <Button variant="secondary" className="rounded-full">
                      <Award className="h-4 w-4 mr-2" />
                      Episode Test
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Episodes List */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="p-4">
              <h3 className="font-medium">Episodes</h3>
              <p className="text-sm text-muted-foreground">Click an episode to play</p>
            </div>
            <Separator />
            <div className="max-h-[440px] overflow-auto">
              {(episodes || []).map((ep, idx) => {
                const active = selected?.id === ep.id
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelected(ep)
                      setIsPlaying(false)
                      if (videoRef.current) videoRef.current.currentTime = 0
                    }}
                    className={`w-full p-3 text-left flex items-center gap-3 hover:bg-muted/50 ${
                      active ? "bg-muted/70" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-violet-100 dark:bg-violet-900/30">
                      <VideoIcon className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {idx + 1}. {ep.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{Math.round(ep.durationSeconds / 60)} min</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
