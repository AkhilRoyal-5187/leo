import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-600 via-violet-600 to-orange-500">
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="animate-pulse mb-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-400 via-violet-400 to-green-400 opacity-75"></div>
            <h1 className="relative text-6xl font-bold text-white">LEO</h1>
          </div>
          <p className="mt-2 text-xl text-white/90">Learn. Educate. Organize.</p>
        </div>
        <div className="w-full max-w-md space-y-4">
          <Link href="/login">
            <Button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 h-12 rounded-xl font-medium">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-white/80">Empowering students with futuristic learning tools</p>
        </div>
      </div>
    </div>
  )
}
