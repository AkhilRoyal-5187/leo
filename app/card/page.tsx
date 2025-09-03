"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import {
  CreditCard,
  Copy,
  Download,
  Share2,
  BanknoteIcon as Bank,
  Smartphone,
  ArrowRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Image from "next/image"

export default function CardPage() {
  const [transactions] = useState([
    {
      id: 1,
      type: "credit",
      amount: 250,
      description: "Course Completion Reward",
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      type: "debit",
      amount: 120,
      description: "Premium Backpack Purchase",
      date: "Yesterday, 3:15 PM",
    },
    {
      id: 3,
      type: "credit",
      amount: 100,
      description: "Quiz Competition Winner",
      date: "Apr 10, 2023",
    },
    {
      id: 4,
      type: "debit",
      amount: 50,
      description: "Study Planner Purchase",
      date: "Apr 5, 2023",
    },
  ])

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">LEO Card</h1>
          <p className="text-muted-foreground">Your digital student card and wallet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-medium">LEO Card</span>
                    </div>
                    <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">Student</Badge>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Coin"
                        width={20}
                        height={20}
                        className="animate-pulse"
                      />
                      <span className="text-white/70 text-sm">Balance</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">2,450</h2>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-white/70 text-xs mb-1">Card Holder</p>
                      <p className="text-white font-medium">Alex Johnson</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-1">Card ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">LEO-2023-4567-8901</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <div className="h-14 w-14 bg-white/5 rounded-lg flex items-center justify-center">
                        <Image src="/placeholder.svg?height=40&width=40" alt="QR Code" width={40} height={40} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium">Transfer Options</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-800 flex items-center justify-center">
                        <Bank className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Bank Account</p>
                        <p className="text-xs text-muted-foreground">Transfer to your bank</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">UPI Transfer</p>
                        <p className="text-xs text-muted-foreground">Transfer via UPI</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
                  Convert Coins to Money
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md h-full">
              <CardContent className="p-6">
                <Tabs defaultValue="transactions">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="settings">Card Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transactions" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Recent Transactions</h3>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {transactions.map((transaction) => (
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
                                <span>{transaction.date}</span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              transaction.type === "credit"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Card Settings</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Card Visibility</p>
                              <p className="text-xs text-muted-foreground">Control who can see your card</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Bank className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Linked Accounts</p>
                              <p className="text-xs text-muted-foreground">Manage your linked accounts</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                              <Image src="/placeholder.svg?height=24&width=24" alt="Coin" width={20} height={20} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Coin Conversion Rate</p>
                              <p className="text-xs text-muted-foreground">Current rate: 1 Coin = ₹0.50</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Security</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Two-Factor Authentication</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Enabled</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
