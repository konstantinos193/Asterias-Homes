import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl md:text-[12rem] font-cormorant font-bold text-[#0A4A4A] leading-none">
            404
          </h1>
          <div className="h-1 w-24 bg-[#0A4A4A] mx-auto"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-slate-800">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 font-alegreya max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            asChild
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya px-8 py-6 text-lg"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white font-alegreya px-8 py-6 text-lg"
          >
            <Link href="/el/rooms">
              <Search className="mr-2 h-5 w-5" />
              Browse Rooms
            </Link>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 font-alegreya mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/el" 
              className="text-[#0A4A4A] hover:underline font-alegreya"
            >
              Home
            </Link>
            <Link 
              href="/el/rooms" 
              className="text-[#0A4A4A] hover:underline font-alegreya"
            >
              Rooms
            </Link>
            <Link 
              href="/el/about" 
              className="text-[#0A4A4A] hover:underline font-alegreya"
            >
              About
            </Link>
            <Link 
              href="/el/contact" 
              className="text-[#0A4A4A] hover:underline font-alegreya"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

