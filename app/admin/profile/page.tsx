"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Key,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { logger } from "@/lib/logger"
import { format } from "date-fns"
import { el } from "date-fns/locale"

interface ProfileData {
  name: string
  email: string
  phone?: string
  username?: string
  role: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function AdminProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    username: "",
    role: "ADMIN",
    isActive: true,
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
        role: user.role || "ADMIN",
        isActive: user.isActive ?? true,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
        lastLogin: (user as any).lastLogin,
      })
    }
  }, [user])

  const updateProfileField = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const saveProfile = async () => {
    if (!hasChanges) return

    setSaving(true)
    try {
      // Use the API client to update profile
      const response = await api.auth.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      })

      logger.info("Profile updated successfully")
      toast.success("Το προφίλ ενημερώθηκε επιτυχώς!")
      setHasChanges(false)
      
      // Refresh user data
      window.location.reload()
    } catch (error) {
      logger.error("Profile update error", error as Error)
      toast.error("Σφάλμα κατά την ενημέρωση του προφίλ")
    } finally {
      setSaving(false)
    }
  }

  const validatePassword = (): boolean => {
    const errors: string[] = []

    if (!passwordData.currentPassword) {
      errors.push("Το τρέχον κωδικό πρόσβασης είναι υποχρεωτικό")
    }

    if (!passwordData.newPassword) {
      errors.push("Ο νέος κωδικός πρόσβασης είναι υποχρεωτικός")
    } else if (passwordData.newPassword.length < 8) {
      errors.push("Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες")
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push("Οι νέοι κωδικοί δεν ταιριάζουν")
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.push("Ο νέος κωδικός πρέπει να είναι διαφορετικός από τον τρέχοντα")
    }

    setPasswordErrors(errors)
    return errors.length === 0
  }

  const changePassword = async () => {
    if (!validatePassword()) {
      toast.error("Παρακαλώ διορθώστε τα σφάλματα")
      return
    }

    setSaving(true)
    try {
      // Use the API client to change password
      const data = await api.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      logger.info("Password changed successfully")
      toast.success("Ο κωδικός πρόσβασης άλλαξε επιτυχώς!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordErrors([])
    } catch (error) {
      logger.error("Password change error", error as Error)
      const errorMessage = error instanceof Error ? error.message : "Σφάλμα κατά την αλλαγή του κωδικού"
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A4A4A] mx-auto"></div>
          <p className="mt-2 text-slate-600 font-alegreya">Φόρτωση προφίλ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-cormorant font-semibold text-slate-800">
            Προφίλ Χρήστη
          </h1>
          <p className="text-slate-600 mt-1 font-alegreya">
            Διαχείριση προσωπικών πληροφοριών και ρυθμίσεων
          </p>
        </div>
      </div>

      {/* Status Banner */}
      {hasChanges && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="font-alegreya text-amber-800">
              Έχετε μη αποθηκευμένες αλλαγές. Μην ξεχάσετε να τις αποθηκεύσετε!
            </span>
          </CardContent>
        </Card>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-2">
          <TabsTrigger value="info" className="font-alegreya">
            <User className="h-4 w-4 mr-2" />
            Προσωπικά Στοιχεία
          </TabsTrigger>
          <TabsTrigger value="password" className="font-alegreya">
            <Key className="h-4 w-4 mr-2" />
            Αλλαγή Κωδικού
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="info">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <User className="h-5 w-5 text-[#0A4A4A]" />
                  Βασικές Πληροφορίες
                </CardTitle>
                <CardDescription className="font-alegreya">
                  Ενημέρωση των προσωπικών σας στοιχείων
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="font-alegreya">
                      Όνομα <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => updateProfileField("name", e.target.value)}
                      className="font-alegreya"
                      placeholder="Εισάγετε το όνομά σας"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-alegreya">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="font-alegreya bg-slate-100"
                    />
                    <p className="text-xs text-slate-500 font-alegreya mt-1">
                      Το email δεν μπορεί να αλλάξει
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-alegreya">
                      Τηλέφωνο
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone || ""}
                      onChange={(e) => updateProfileField("phone", e.target.value)}
                      className="font-alegreya"
                      placeholder="Εισάγετε το τηλέφωνο σας"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="font-alegreya">
                      Όνομα Χρήστη
                    </Label>
                    <Input
                      id="username"
                      value={profileData.username || ""}
                      disabled
                      className="font-alegreya bg-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={saveProfile}
                    disabled={!hasChanges || saving}
                    className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Αποθήκευση..." : "Αποθήκευση"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Shield className="h-5 w-5 text-[#0A4A4A]" />
                  Πληροφορίες Λογαριασμού
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-alegreya text-slate-600">Ρόλος</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        className={`font-alegreya ${profileData.role === "ADMIN" ? "bg-[#0A4A4A] text-white" : "bg-slate-200 text-slate-700"}`}
                      >
                        {profileData.role === "ADMIN" ? "Διαχειριστής" : "Χρήστης"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="font-alegreya text-slate-600">Κατάσταση</Label>
                    <div className="mt-1 flex items-center gap-2">
                      {profileData.isActive ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-alegreya text-green-700">Ενεργός</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-alegreya text-red-700">Ανενεργός</span>
                        </>
                      )}
                    </div>
                  </div>
                  {profileData.createdAt && (
                    <div>
                      <Label className="font-alegreya text-slate-600">Ημερομηνία Δημιουργίας</Label>
                      <p className="mt-1 font-alegreya text-slate-700">
                        {format(new Date(profileData.createdAt), "PPP", { locale: el })}
                      </p>
                    </div>
                  )}
                  {profileData.lastLogin && (
                    <div>
                      <Label className="font-alegreya text-slate-600">Τελευταία Σύνδεση</Label>
                      <p className="mt-1 font-alegreya text-slate-700">
                        {format(new Date(profileData.lastLogin), "PPP 'στις' HH:mm", { locale: el })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Password Change */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cormorant">
                <Key className="h-5 w-5 text-[#0A4A4A]" />
                Αλλαγή Κωδικού Πρόσβασης
              </CardTitle>
              <CardDescription className="font-alegreya">
                Αλλαγή του κωδικού πρόσβασης του λογαριασμού σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passwordErrors.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700 font-alegreya">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="font-alegreya">
                    Τρέχων Κωδικός <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="font-alegreya pr-10"
                      placeholder="Εισάγετε τον τρέχοντα κωδικό"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="font-alegreya">
                    Νέος Κωδικός <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="font-alegreya pr-10"
                      placeholder="Εισάγετε τον νέο κωδικό (min 8 χαρακτήρες)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                      }
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 font-alegreya mt-1">
                    Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="font-alegreya">
                    Επιβεβαίωση Νέου Κωδικού <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="font-alegreya pr-10"
                      placeholder="Εισάγετε ξανά τον νέο κωδικό"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                      }
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={changePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {saving ? "Αλλαγή..." : "Αλλαγή Κωδικού"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

