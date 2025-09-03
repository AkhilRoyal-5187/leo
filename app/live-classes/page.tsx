"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AppLayout } from "@/components/app-layout"
import { Clock, Video, User, Play, CalendarIcon, Bell, Check } from "lucide-react"
import Image from "next/image"

export default function LiveClassesPage() {
  const [activeDay, setActiveDay] = useState("today")
  const [reminders, setReminders] = useState([])
  const [reminderSettings, setReminderSettings] = useState({
    minutes: 15,
    methods: ["push"],
  })

  const days = [
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
  ]

  const upcomingClasses = [
    {
      id: 1,
      title: "Advanced Calculus",
      subject: "Mathematics",
      teacher: "Dr. Sarah Johnson",
      teacherImage: "/placeholder.svg?height=100&width=100",
      time: "10:00 AM - 11:30 AM",
      date: "Today",
      status: "upcoming",
      remainingTime: "00:45:30",
      participants: 24,
      coins: 30,
    },
    {
      id: 2,
      title: "Python Programming Basics",
      subject: "Programming",
      teacher: "Dr. Rajesh Kumar",
      teacherImage: "/placeholder.svg?height=100&width=100",
      time: "01:00 PM - 02:30 PM",
      date: "Today",
      status: "upcoming",
      remainingTime: "03:45:30",
      participants: 18,
      coins: 35,
    },
    {
      id: 3,
      title: "Indian Constitution Overview",
      subject: "Civics",
      teacher: "Dr. Meera Gupta",
      teacherImage: "/placeholder.svg?height=100&width=100",
      time: "03:30 PM - 05:00 PM",
      date: "Today",
      status: "upcoming",
      remainingTime: "06:15:30",
      participants: 22,
      coins: 25,
    },
  ]

  const recordedClasses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      subject: "Programming",
      teacher: "Ms. Priya Sharma",
      teacherImage: "/placeholder.svg?height=100&width=100",
      duration: "1h 30m",
      date: "Yesterday",
      views: 156,
      coins: 30,
    },
    {
      id: 2,
      title: "Data Structures Introduction",
      subject: "Programming",
      teacher: "Prof. Amit Agarwal",
      teacherImage: "/placeholder.svg?height=100&width=100",
      duration: "1h 45m",
      date: "2 days ago",
      views: 124,
      coins: 35,
    },
    {
      id: 3,
      title: "Public Administration Principles",
      subject: "Public Administration",
      teacher: "Mr. Suresh Reddy",
      teacherImage: "/placeholder.svg?height=100&width=100",
      duration: "1h 15m",
      date: "3 days ago",
      views: 98,
      coins: 25,
    },
  ]

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders?userId=1&type=live_class")
      const result = await response.json()
      if (result.success) {
        setReminders(result.data)
      }
    } catch (error) {
      console.error("Error fetching reminders:", error)
    }
  }

  const handleSetReminder = async (classId: number, classTitle: string, scheduledTime: string) => {
    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_reminder",
          userId: 1,
          type: "live_class",
          itemId: classId,
          title: classTitle,
          scheduledTime,
          reminderMinutes: reminderSettings.minutes,
          notificationMethods: reminderSettings.methods,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Reminder set successfully! 🔔")
        fetchReminders()
      } else {
        alert(result.error || "Failed to set reminder")
      }
    } catch (error) {
      console.error("Error setting reminder:", error)
      alert("Failed to set reminder")
    }
  }

  const isReminderSet = (classId: number) => {
    return reminders.some((reminder: any) => reminder.itemId === classId && reminder.status === "active")
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Live Classes</h1>
            <p className="text-muted-foreground">Join interactive live sessions with expert teachers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 p-2 rounded-lg">
              <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full">
                <Image
                  src="/placeholder.svg?height=24&width=24&text=💰"
                  alt="Coin"
                  width={16}
                  height={16}
                  className="animate-pulse"
                />
              </div>
              <div>
                <p className="text-xs text-white/80">Earn up to</p>
                <p className="font-bold text-white text-sm">35 💰 per class</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex overflow-auto pb-2 gap-2 scrollbar-hide">
              {days.map((day) => (
                <Button
                  key={day.id}
                  variant={activeDay === day.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveDay(day.id)}
                  className={`rounded-full min-w-[80px] ${
                    activeDay === day.id ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white" : ""
                  }`}
                >
                  {day.label}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {upcomingClasses.map((liveClass) => (
                <Card
                  key={liveClass.id}
                  className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative w-full md:w-16 h-16 rounded-full overflow-hidden border-2 border-violet-200 dark:border-violet-800">
                          <Image
                            src={liveClass.teacherImage || "/placeholder.svg"}
                            alt={liveClass.teacher}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{liveClass.title}</h3>
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                Live Soon
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{liveClass.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">
                              <Image
                                src="/placeholder.svg?height=16&width=16&text=💰"
                                alt="Coin"
                                width={14}
                                height={14}
                              />
                              <span className="font-medium">{liveClass.coins}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-violet-500" />
                              <span>{liveClass.participants} joined</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-blue-500" />
                            <span>{liveClass.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>{liveClass.time}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 px-3 py-1.5 rounded-full text-sm">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Starts in {liveClass.remainingTime}</span>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${
                                    isReminderSet(liveClass.id)
                                      ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300"
                                      : ""
                                  }`}
                                >
                                  {isReminderSet(liveClass.id) ? (
                                    <>
                                      <Check className="h-4 w-4 mr-1" />
                                      Reminder Set
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="h-4 w-4 mr-1" />
                                      Set Reminder
                                    </>
                                  )}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Set Class Reminder</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">{liveClass.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {liveClass.time} • {liveClass.teacher}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Remind me before:</label>
                                    <Select
                                      value={reminderSettings.minutes.toString()}
                                      onValueChange={(value) =>
                                        setReminderSettings((prev) => ({ ...prev, minutes: Number.parseInt(value) }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="5">5 minutes</SelectItem>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Notification methods:</label>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="push"
                                          checked={reminderSettings.methods.includes("push")}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setReminderSettings((prev) => ({
                                                ...prev,
                                                methods: [...prev.methods, "push"],
                                              }))
                                            } else {
                                              setReminderSettings((prev) => ({
                                                ...prev,
                                                methods: prev.methods.filter((m) => m !== "push"),
                                              }))
                                            }
                                          }}
                                        />
                                        <label htmlFor="push" className="text-sm">
                                          Push notification
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="email"
                                          checked={reminderSettings.methods.includes("email")}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setReminderSettings((prev) => ({
                                                ...prev,
                                                methods: [...prev.methods, "email"],
                                              }))
                                            } else {
                                              setReminderSettings((prev) => ({
                                                ...prev,
                                                methods: prev.methods.filter((m) => m !== "email"),
                                              }))
                                            }
                                          }}
                                        />
                                        <label htmlFor="email" className="text-sm">
                                          Email notification
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                                    onClick={() => {
                                      const scheduledTime = new Date()
                                      scheduledTime.setHours(10, 0, 0, 0) // Mock scheduled time
                                      handleSetReminder(liveClass.id, liveClass.title, scheduledTime.toISOString())
                                    }}
                                  >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Set Reminder
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                              Join Class
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recorded" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recordedClasses.map((recordedClass) => (
                <Card
                  key={recordedClass.id}
                  className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="icon"
                          className="rounded-full w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30"
                        >
                          <Play className="h-5 w-5 ml-1" />
                        </Button>
                      </div>
                      <Video className="h-12 w-12 text-violet-300 dark:text-violet-500 opacity-20" />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/60 text-white hover:bg-black/70 border-0">
                        {recordedClass.duration}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <div className="flex items-center gap-1 bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs">
                        <Image src="/placeholder.svg?height=12&width=12&text=💰" alt="Coin" width={12} height={12} />
                        <span className="font-medium">{recordedClass.coins}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{recordedClass.title}</h3>
                    <p className="text-sm text-muted-foreground">{recordedClass.subject}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={recordedClass.teacherImage || "/placeholder.svg"}
                          alt={recordedClass.teacher}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs">{recordedClass.teacher}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {recordedClass.views} views • {recordedClass.date}
                    </div>
                    <Button size="sm" variant="ghost" className="rounded-full">
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
