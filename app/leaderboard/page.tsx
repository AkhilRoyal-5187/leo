"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Trophy, Medal, Clock, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const topStudents = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "10th Grade",
      coins: 2450,
      rank: 1,
      isCurrentUser: true,
    },
    {
      id: 2,
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "10th Grade",
      coins: 2380,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "Ethan Brown",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "9th Grade",
      coins: 2310,
      rank: 3,
      isCurrentUser: false,
    },
    {
      id: 4,
      name: "Olivia Davis",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "10th Grade",
      coins: 2250,
      rank: 4,
      isCurrentUser: false,
    },
    {
      id: 5,
      name: "Noah Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "11th Grade",
      coins: 2180,
      rank: 5,
      isCurrentUser: false,
    },
    {
      id: 6,
      name: "Emma Martinez",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "9th Grade",
      coins: 2120,
      rank: 6,
      isCurrentUser: false,
    },
    {
      id: 7,
      name: "Liam Garcia",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "10th Grade",
      coins: 2050,
      rank: 7,
      isCurrentUser: false,
    },
    {
      id: 8,
      name: "Ava Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "11th Grade",
      coins: 1980,
      rank: 8,
      isCurrentUser: false,
    },
    {
      id: 9,
      name: "William Lee",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "10th Grade",
      coins: 1920,
      rank: 9,
      isCurrentUser: false,
    },
    {
      id: 10,
      name: "Isabella Hernandez",
      avatar: "/placeholder.svg?height=100&width=100",
      class: "9th Grade",
      coins: 1850,
      rank: 10,
      isCurrentUser: false,
    },
  ]

  const filteredStudents = topStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">See where you stand among your peers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9 w-full md:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="coins">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="coins">Top Earners</TabsTrigger>
            <TabsTrigger value="active">Most Active</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Champs</TabsTrigger>
          </TabsList>

          <TabsContent value="coins" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topStudents.slice(0, 3).map((student) => (
                <Card
                  key={student.id}
                  className={`border-0 shadow-md overflow-hidden ${
                    student.rank === 1
                      ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
                      : student.rank === 2
                        ? "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20"
                        : "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="relative mb-2">
                      <div
                        className={`absolute -inset-1 rounded-full blur-sm ${
                          student.rank === 1
                            ? "bg-yellow-400/30"
                            : student.rank === 2
                              ? "bg-gray-400/30"
                              : "bg-orange-400/30"
                        } animate-pulse`}
                      ></div>
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
                        <Image
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div
                      className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center ${
                        student.rank === 1
                          ? "bg-yellow-100 dark:bg-yellow-900/50"
                          : student.rank === 2
                            ? "bg-gray-100 dark:bg-gray-900/50"
                            : "bg-orange-100 dark:bg-orange-900/50"
                      }`}
                    >
                      {student.rank === 1 ? (
                        <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      ) : student.rank === 2 ? (
                        <Medal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Medal className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      )}
                    </div>

                    <h3 className="font-semibold mt-2">{student.name}</h3>
                    <Badge className="mt-1 bg-white/50 dark:bg-gray-800/50 text-foreground">{student.class}</Badge>

                    <div className="mt-4 flex items-center gap-2">
                      <Image src="/placeholder.svg?height=24&width=24" alt="Coin" width={20} height={20} />
                      <span className="font-bold text-lg">{student.coins}</span>
                    </div>

                    {student.isCurrentUser && (
                      <Badge className="mt-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0">
                        You
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Rank</th>
                        <th className="text-left p-4 font-medium">Student</th>
                        <th className="text-left p-4 font-medium">Class</th>
                        <th className="text-right p-4 font-medium">LEO Coins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className={`border-b last:border-0 ${
                            student.isCurrentUser ? "bg-violet-50 dark:bg-violet-900/10" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              {student.rank <= 3 ? (
                                <div
                                  className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 ${
                                    student.rank === 1
                                      ? "bg-yellow-100 dark:bg-yellow-900/50"
                                      : student.rank === 2
                                        ? "bg-gray-100 dark:bg-gray-900/50"
                                        : "bg-orange-100 dark:bg-orange-900/50"
                                  }`}
                                >
                                  {student.rank === 1 ? (
                                    <Trophy className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                  ) : student.rank === 2 ? (
                                    <Medal className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                  ) : (
                                    <Medal className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm font-medium w-6 text-center mr-2">{student.rank}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                  src={student.avatar || "/placeholder.svg"}
                                  alt={student.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              </div>
                              <span className="font-medium">{student.name}</span>
                              {student.isCurrentUser && (
                                <Badge className="ml-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white border-0">
                                  You
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="font-normal">
                              {student.class}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Image src="/placeholder.svg?height=16&width=16" alt="Coin" width={16} height={16} />
                              <span className="font-bold">{student.coins}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're working on tracking activity time to show the most active students.
              </p>
              <Button className="mt-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                Get Notified
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Weekly Challenges Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                Weekly challenges and competitions are coming soon. Compete with your peers and win exciting rewards!
              </p>
              <Button className="mt-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                Get Notified
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
