"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, Briefcase, ShoppingBag, User, Trophy, HelpCircle, Wallet, CreditCard,Coins } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

export default function Dashboard() {
  const [quote] = useState("The future belongs to those who learn more skills and combine them in creative ways.")

  const menuItems = [
    { icon: BookOpen, title: "Courses", href: "/courses", color: "from-blue-500 to-violet-600" },
    // { icon: Video, title: "Live Classes", href: "/live-classes", color: "from-violet-500 to-purple-600" },
    // { icon: Briefcase, title: "Internships", href: "/internships", color: "from-purple-500 to-pink-600" },
    { icon: ShoppingBag, title: "LEO Store", href: "/store", color: "from-orange-500 to-red-600" },
    { icon: Trophy, title: "Leaderboard", href: "/leaderboard", color: "from-blue-500 to-cyan-600" },
    { icon: Wallet, title: "LEO Coins", href: "/coins", color: "from-yellow-500 to-orange-600" },
    // { icon: CreditCard, title: "LEO Card", href: "/card", color: "from-pink-500 to-rose-600" },
    // { icon: HelpCircle, title: "Help Center", href: "/help", color: "from-teal-500 to-green-600" },
    
  ]

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-blue-500 p-2 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              {/* <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Coin"
                width={20}
                height={20}
                className="animate-pulse"
              /> */}
              <Coins color="gold" size={30} />
            </div>
            <div>
              <p className="text-xs text-white/80">LEO Coins</p>
              <p className="font-bold text-white">2,450</p>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 overflow-hidden">
          <CardContent className="p-4 md:p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative">
              <p className="text-sm md:text-base italic">&quot;{quote}&quot;</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-xs text-muted-foreground">Daily Goal: 2/3 courses completed</p>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
                  style={{ width: "66%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-br ${item.color} p-6 flex flex-col items-center justify-center text-white h-full min-h-[140px] transition-all group-hover:scale-[1.02]`}
                  >
                    <div className="bg-white/20 p-2 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-center">{item.title}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium">Continue Learning</h3>
            <p className="text-sm text-muted-foreground">Advanced Mathematics - Chapter 4</p>
          </div>
          <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700">
            Resume
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
