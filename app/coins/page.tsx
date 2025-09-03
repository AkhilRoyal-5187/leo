"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Coins, TrendingUp, Gift, Users, BookOpen, Trophy, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import Image from "next/image"

interface Transaction {
  id: number
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  source: string
}

export default function CoinsPage() {
  const [totalCoins, setTotalCoins] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoinsData()
  }, [])

  const fetchCoinsData = async () => {
    try {
      const response = await fetch("/api/coins?userId=1")
      const result = await response.json()
      if (result.success) {
        setTotalCoins(result.data.totalCoins)
        setTransactions(result.data.transactions)
      }
    } catch (error) {
      console.error("Error fetching coins data:", error)
    } finally {
      setLoading(false)
    }
  }

  const earningMethods = [
    {
      icon: BookOpen,
      title: "Complete Courses",
      description: "Earn 120+ coins per course",
      color: "from-blue-500 to-violet-600",
    },
    {
      icon: Trophy,
      title: "Pass Quizzes",
      description: "Get 50+ coins per quiz",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Gift,
      title: "Daily Login",
      description: "Earn 10 coins daily",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: Users,
      title: "Refer Friends",
      description: "Get 100 coins per referral",
      color: "from-green-500 to-teal-600",
    },
  ]

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p>Loading your coins...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">LEO Coins Wallet</h1>
          <p className="text-muted-foreground">Track and manage your educational rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-violet-600 to-blue-600">
              <CardContent className="p-6 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Total Balance</p>
                      <h2 className="text-3xl font-bold">{totalCoins.toLocaleString()}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-300" />
                        <span className="text-xs text-white/80">This Month</span>
                      </div>
                      <p className="text-lg font-semibold">+450</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Gift className="h-4 w-4 text-yellow-300" />
                        <span className="text-xs text-white/80">Rank</span>
                      </div>
                      <p className="text-lg font-semibold">#1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Recent Transactions</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === "credit"
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <ArrowUpRight className={`h-5 w-5 text-green-600 dark:text-green-400`} />
                          ) : (
                            <ArrowDownRight className={`h-5 w-5 text-red-600 dark:text-red-400`} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "credit"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {transaction.amount}
                        </span>
                        <Image src="/placeholder.svg?height=16&width=16" alt="Coin" width={16} height={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">How to Earn More Coins</h3>
                <div className="space-y-3">
                  {earningMethods.map((method, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div
                        className={`h-10 w-10 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center`}
                      >
                        <method.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{method.title}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Coin Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Courses Completed</span>
                    <Badge variant="outline">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quizzes Passed</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Friends Referred</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Streaks</span>
                    <Badge variant="outline">15 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium mb-2">Daily Bonus</h3>
                <p className="text-sm text-muted-foreground mb-4">Login daily to earn bonus coins!</p>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700">
                  Claim 10 Coins
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
