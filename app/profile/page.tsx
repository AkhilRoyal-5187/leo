"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Mail, Phone, MapPin, Edit, BookOpen, Award, CreditCard, ChevronRight, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProfilePage() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Education St, Learning City",
    avatar: "/placeholder.svg?height=200&width=200",
    class: "10th Grade",
    joinDate: "September 2022",
    totalCoins: 2450,
    completedCourses: 12,
    achievements: [
      { id: 1, name: "Fast Learner", description: "Completed 10 courses", icon: "🚀" },
      { id: 2, name: "Math Wizard", description: "Scored 95% in Mathematics", icon: "🧙‍♂️" },
      { id: 3, name: "Science Explorer", description: "Completed all science courses", icon: "🔬" },
    ],
    enrolledCourses: [
      { id: 1, name: "Advanced Mathematics", progress: 75, icon: "📊" },
      { id: 2, name: "Physics Fundamentals", progress: 60, icon: "⚛️" },
      { id: 3, name: "Chemistry Basics", progress: 40, icon: "🧪" },
    ],
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and track your progress</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-violet-600 to-blue-600 p-6 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full blur-sm bg-white/30 animate-pulse"></div>
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                    <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                  </div>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{user.name}</h2>
                <Badge className="mt-1 bg-white/20 text-white hover:bg-white/30 border-0">{user.class}</Badge>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-800 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">LEO Card</p>
                      <p className="text-xs text-muted-foreground">View your digital card</p>
                    </div>
                  </div>
                  <Link href="/card">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{user.address}</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <Tabs defaultValue="courses">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="courses">My Courses</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="courses" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Enrolled Courses</h3>
                      <Badge variant="outline" className="font-normal">
                        {user.enrolledCourses.length} Active
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {user.enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">
                            {course.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{course.name}</p>
                              <p className="text-sm">{course.progress}%</p>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-gradient-to-r from-violet-500 to-blue-500 h-1.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <h3 className="font-medium">Completed Courses</h3>
                        <p className="text-sm text-muted-foreground">Total: {user.completedCourses}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Your Achievements</h3>
                      <Badge variant="outline" className="font-normal">
                        {user.achievements.length} Earned
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {user.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                        >
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl">
                            {achievement.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{achievement.name}</p>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-muted-foreground">Complete more courses to unlock achievements</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">LEO Stats</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Courses Completed</p>
                        <p className="text-xl font-bold">{user.completedCourses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Achievements</p>
                        <p className="text-xl font-bold">{user.achievements.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Image src="/placeholder.svg?height=24&width=24" alt="Coin" width={20} height={20} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total LEO Coins</p>
                        <p className="text-xl font-bold">{user.totalCoins}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
