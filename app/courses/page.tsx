"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, Filter, Code, Building } from "lucide-react"

type CourseListItem = {
  id: number
  title: string
  category: string
  thumbnail: string
  description: string
  teacher: { id: number; name: string; avatar?: string }
  episodesCount: number
}

type Course = {
  id: number
  title: string
  subject?: string
  level?: string
  description?: string
  thumbnail?: string
  duration?: string
  rating?: number
  coins?: number
  category?: "academic" | "programming" | "government" | "all" | string
  teacherId?: number
  teacher?: {
    name?: string
    specialization?: string
    avatar?: string
    experience?: string
    idCard?: {
      employeeId?: string
      department?: string
      qualification?: string
    } | null
  }
}

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" })
        const json = await res.json()
        if (!json?.success) throw new Error(json?.error || "Failed to load courses")
        setCourses(Array.isArray(json.data) ? json.data : [])
      } catch (e: any) {
        setError(e?.message || "Failed to load courses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filters = [
    { id: "all", label: "All", icon: BookOpen },
    { id: "academic", label: "1st Year", icon: BookOpen },
    { id: "programming", label: "2nd Year", icon: BookOpen },
    { id: "government", label: "3rd Year", icon: BookOpen },
    { id: "final", label: "4th Year", icon: BookOpen },
  ]

  const filteredCourses = courses.filter((c) => activeFilter === "all" || c.category === activeFilter)

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", { cache: "no-store" })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.error || "Failed to load courses")
      setCourses(Array.isArray(json.data) ? json.data : [])
    } catch (e: any) {
      setError(e?.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="font-medium">Something went wrong</p>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchCourses} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Explore and learn from our wide range of courses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 p-2 rounded-lg">
              <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                <Image src="/single-gold-coin.png" alt="Coin" width={16} height={16} className="animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-white/80">Earn up to</p>
                <p className="font-bold text-white text-sm">300 leo coins  per course</p>
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="courses">All Courses</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex overflow-auto pb-2 gap-2 scrollbar-hide">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full flex items-center gap-2 ${
                    activeFilter === filter.id ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white" : ""
                  }`}
                >
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <Image
                      src={course.thumbnail || "/placeholder.svg?height=160&width=320&query=course-thumbnail"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{course.title}</h3>
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{course.episodesCount} episodes</p>
                      <Link href={`/courses/${course.id}`}>
                        <Button size="sm" className="rounded-full">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teachers">
            <TeachersSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

function TeachersSection() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      // Build teachers list from courses if API doesn't return teachers directly
      const response = await fetch("/api/courses")
      const result = await response.json()
      const payload = result?.data
      const list: Course[] = Array.isArray(payload) ? payload : Array.isArray(payload?.courses) ? payload.courses : []

      const teacherMap = new Map<
        string | number,
        {
          id: string | number
          name: string
          specialization: string
          avatar: string
          rating: number
          studentsCount: number
          coursesCount: number
          experience?: string
          idCard?: { employeeId?: string; department?: string; qualification?: string } | null
        }
      >()

      list.forEach((c) => {
        const t = c.teacher || {}
        const key = (c.teacherId as number | undefined) ?? (t.name as string | undefined) ?? `t-${c.id}`
        const id = key
        const existing = teacherMap.get(key)
        if (existing) {
          existing.coursesCount += 1
        } else {
          teacherMap.set(key, {
            id,
            name: t.name || "Teacher",
            specialization: t.specialization || c.subject || "Instructor",
            avatar: t.avatar || "/teacher-avatar.png",
            rating: c.rating ?? 4.7,
            studentsCount: 0,
            coursesCount: 1,
            experience: t.experience || "—",
            idCard: t.idCard || null,
          })
        }
      })

      setTeachers(Array.from(teacherMap.values()))
    } catch (err) {
      console.error("Error fetching teachers:", err)
      setError("Failed to load teachers.")
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-2">
          <p className="font-medium">Could not load teachers</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button onClick={fetchTeachers} size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const safeTeachers = Array.isArray(teachers) ? teachers : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeTeachers.map((teacher: any) => (
        <Card key={teacher.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-violet-400 to-blue-400 opacity-75"></div>
                <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
                  <Image
                    src={teacher.avatar || "/placeholder.svg?height=200&width=200&query=teacher-avatar"}
                    alt={teacher.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-lg">{teacher.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{teacher.specialization}</p>

              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{teacher.rating}</span>
                <span className="text-xs text-muted-foreground">({teacher.studentsCount} students)</span>
              </div>

              <div className="w-full bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{teacher.experience || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Courses</p>
                    <p className="font-medium">{teacher.coursesCount}</p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 bg-gradient-to-r from-violet-600 to-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                      ID
                    </div>
                    <span className="text-xs font-medium">Teacher ID Card</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee ID:</span>
                      <span className="font-mono">{teacher.idCard?.employeeId || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{teacher.idCard?.department || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Qualification:</span>
                      <span>{teacher.idCard?.qualification || "—"}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
