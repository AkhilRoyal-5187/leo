"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  BookOpen,
  Video,
  Briefcase,
  ShoppingBag,
  User,
  Trophy,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Wallet,
  CreditCard,
  Search,
  Bell,
} from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, title: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, title: "Courses", href: "/courses" },
    { icon: Video, title: "Live Classes", href: "/live-classes" },
    { icon: Briefcase, title: "Internships", href: "/internships" },
    { icon: ShoppingBag, title: "LEO Store", href: "/store" },
    { icon: User, title: "Profile", href: "/profile" },
    { icon: Trophy, title: "Leaderboard", href: "/leaderboard" },
    { icon: Wallet, title: "LEO Coins", href: "/coins" },
    { icon: CreditCard, title: "LEO Card", href: "/card" },
    { icon: HelpCircle, title: "Help Center", href: "/help" },
  ]

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r">
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75"></div>
              <h1 className="relative text-2xl font-bold">LEO</h1>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header and Content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 bg-background border-b h-14 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75"></div>
                        <h1 className="relative text-2xl font-bold">LEO</h1>
                      </div>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-2">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.title}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                              : "hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="md:hidden flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75"></div>
                <h1 className="relative text-2xl font-bold">LEO</h1>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile">
              <div className="h-8 w-8 rounded-full overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
