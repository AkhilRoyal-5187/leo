"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, BookOpen, Stars } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-violet-600 to-orange-500">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="relative">
          {/* Animated background elements */}
          <div className="absolute -z-10 top-20 left-10 w-20 h-20 rounded-full bg-green-400/20 blur-xl animate-float"></div>
          <div className="absolute -z-10 bottom-10 right-10 w-32 h-32 rounded-full bg-orange-400/20 blur-xl animate-float-delay"></div>
          <div className="absolute -z-10 top-40 right-20 w-16 h-16 rounded-full bg-blue-400/20 blur-xl animate-pulse"></div>

          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75 animate-pulse"></div>
                <h1 className="relative text-5xl font-bold text-white">LEO</h1>
              </div>
              <p className="mt-2 text-white/80">Your educational journey begins here</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isLogin ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      !isLogin ? "bg-white/20 text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-violet-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    {isLogin && (
                      <Link href="#" className="text-xs text-white/80 hover:text-white">
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg shadow-violet-600/20"
                >
                  {isLogin ? "Login" : "Create Account"}
                </Button>
              </form>
            </div>

            <div className="mt-6 flex items-center justify-center space-x-4">
              <BookOpen className="h-5 w-5 text-white/70 animate-float" />
              <Stars className="h-5 w-5 text-white/70 animate-float-delay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
