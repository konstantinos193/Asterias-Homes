"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  UsersIcon,
  SettingsIcon,
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  X,
  LineChart,
  Tag,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth, AuthProvider } from "@/hooks/use-auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AuthProvider>
      <AdminLayoutContent
        pathname={pathname}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        router={router}
      >
        {children}
      </AdminLayoutContent>
    </AuthProvider>
  )
}

function AdminLayoutContent({ 
  pathname, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  router, 
  children 
}: { 
  pathname: string
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  router: any
  children: React.ReactNode 
}) {
  const { user } = useAuth()
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const navItems = [
    { href: "/admin", label: "Πίνακας Ελέγχου", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Κρατήσεις", icon: CalendarDays },
    { href: "/admin/rooms", label: "Δωμάτια", icon: BedDouble },
    { href: "/admin/offers", label: "Προσφορές", icon: Tag },
    { href: "/admin/guests", label: "Επισκέπτες", icon: UsersIcon },
    { href: "/admin/users", label: "Χρήστες", icon: ShieldCheck },
    { href: "/admin/contacts", label: "Μηνύματα", icon: MessageSquare },
    { href: "/admin/reports", label: "Αναφορές", icon: LineChart },
    { href: "/admin/settings", label: "Ρυθμίσεις", icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#ddddd3] border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/admin-logo.png" alt="Logo" width={32} height={32} />
              <span className="font-cormorant text-xl font-semibold text-[#0A4A4A]">Πίνακας Διαχείρισης</span>
            </Link>
          </div>
          <nav className="flex-grow p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-alegreya transition-colors",
                  pathname === item.href
                    ? "bg-[#0A4A4A]/15 text-[#0A4A4A] font-semibold"
                    : "text-slate-700 hover:bg-[#c9c9bf] hover:text-slate-900",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                                    {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center px-3 py-2.5 rounded-md text-sm font-alegreya text-slate-700 hover:bg-[#c9c9bf] hover:text-slate-900 transition-colors"
            >
              <ExternalLink className="h-5 w-5 mr-3" />
              Προβολή Ιστοσελίδας
            </Link>
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-alegreya text-slate-700 hover:bg-[#c9c9bf] hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Αποσύνδεση
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-[#ddddd3] border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {/* Breadcrumbs or Page Title can go here */}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" aria-label="Ειδοποιήσεις">
                <Bell className="h-5 w-5 text-slate-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none font-alegreya">{user?.name || 'Admin User'}</p>
                      <p className="text-xs leading-none text-slate-500 font-alegreya">{user?.email || 'admin@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="font-alegreya"
                    onClick={() => router.push('/admin/profile')}
                  >
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Προφίλ
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="font-alegreya"
                    onClick={() => router.push('/admin/settings')}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Ρυθμίσεις
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-alegreya"
                    onClick={() => router.push('/admin/login')}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Αποσύνδεση
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
        {/* Sidebar overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      </div>
    )
  }
