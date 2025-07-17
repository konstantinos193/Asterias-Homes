"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
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
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/hooks/use-auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminLayoutContent
      t={t}
      pathname={pathname}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      router={router}
    >
      {children}
    </AdminLayoutContent>
  )
}

function AdminLayoutContent({ 
  t, 
  pathname, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  router, 
  children 
}: { 
  t: any
  pathname: string
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  router: any
  children: React.ReactNode 
}) {
  const { user, loading, logout } = useAuth()

  // Debug authentication state
  console.log("AdminLayout - Loading:", loading, "User:", user, "Pathname:", pathname)

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="text-slate-600 font-alegreya">Loading...</div>
      </div>
    )
  }

  // Redirect to /admin/login if not authenticated
  if (!user && !loading) {
    useEffect(() => {
      router.replace('/admin/login')
    }, [router])
    return <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">Redirecting to login...</div>
  }
  console.log('ADMIN LAYOUT DEBUG:', { user, loading, authToken: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null });

  const navItems = [
    { href: "/admin", labelKey: "admin.sidebar.dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", labelKey: "admin.sidebar.bookings", icon: CalendarDays },
    { href: "/admin/rooms", labelKey: "admin.sidebar.rooms", icon: BedDouble },
    { href: "/admin/offers", labelKey: "admin.sidebar.offers", icon: Tag },
    { href: "/admin/guests", labelKey: "admin.sidebar.guests", icon: UsersIcon },
    { href: "/admin/reports", labelKey: "admin.sidebar.reports", icon: LineChart },
    { href: "/admin/settings", labelKey: "admin.sidebar.settings", icon: SettingsIcon },
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
              <Image src="https://i.imgur.com/xgXMnQz.png" alt={t("logo.alt")} width={32} height={32} />
              <span className="font-cormorant text-xl font-semibold text-[#0A4A4A]">{t("admin.header.title")}</span>
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
                {t(item.labelKey)}
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
              {t("admin.sidebar.viewSite")}
            </Link>
            <button
              onClick={async () => {
                await logout()
                router.push('/admin/login')
              }}
              className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-alegreya text-slate-700 hover:bg-[#c9c9bf] hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {t("admin.sidebar.logout")}
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
                aria-label={isSidebarOpen ? t("admin.sidebar.close") : t("admin.sidebar.open")}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {/* Breadcrumbs or Page Title can go here */}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" aria-label={t("admin.header.notifications")}>
                <Bell className="h-5 w-5 text-slate-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt={t("admin.userAvatar.alt")} />
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
                  <DropdownMenuItem className="font-alegreya">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    {t("admin.header.user.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-alegreya">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    {t("admin.header.user.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-alegreya"
                    onClick={async () => {
                      await logout()
                      router.push('/admin/login')
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("admin.header.user.logout")}
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
