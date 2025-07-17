"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  Bell,
  Settings,
  Database,
  Save,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Palette,
  Zap,
  AlertTriangle,
  CheckCircle,
  FileText,
  Printer,
  DollarSign,
  Mail,
  Smartphone,
  Globe,
  Key,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface AdminSettings {
  // Booking Rules
  checkInTime: string
  checkOutTime: string
  minAdvanceBooking: number
  maxAdvanceBooking: number
  cancellationPolicy: number // hours before free cancellation
  overbookingAllowed: boolean
  
  // Pricing & Payments
  currency: string
  taxRate: number
  automaticPricing: boolean
  directBookingDiscount: number
  
  // System Preferences
  itemsPerPage: number
  
  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  bookingConfirmations: boolean
  reminderNotifications: boolean
  reminderHours: number
  lowInventoryAlerts: boolean
  newBookingAlerts: boolean
  
  // Security & Backup
  sessionTimeout: number // minutes
  requireTwoFA: boolean
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  maintenanceMode: boolean
  
  // Channel Management
  bookingComIntegration: boolean
  airbnbIntegration: boolean
  expediaIntegration: boolean
  
  // Staff Management
  maxConcurrentSessions: number
  passwordComplexity: boolean
  auditLogging: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    // Booking Rules
    checkInTime: "15:00",
    checkOutTime: "11:00",
    minAdvanceBooking: 1,
    maxAdvanceBooking: 365,
    cancellationPolicy: 48,
    overbookingAllowed: false,
    
    // Pricing & Payments
    currency: "EUR",
    taxRate: 13,
    automaticPricing: false,
    directBookingDiscount: 5,
    
    // System Preferences
    itemsPerPage: 20,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true,
    reminderNotifications: true,
    reminderHours: 24,
    lowInventoryAlerts: true,
    newBookingAlerts: true,
    
    // Security & Backup
    sessionTimeout: 120,
    requireTwoFA: false,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
    
    // Channel Management
    bookingComIntegration: false,
    airbnbIntegration: false,
    expediaIntegration: false,
    
    // Staff Management
    maxConcurrentSessions: 3,
    passwordComplexity: true,
    auditLogging: true
  })

  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setSettings(data.data)
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error("Σφάλμα κατά τη φόρτωση των ρυθμίσεων")
      } finally {
        setInitialLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings')
      }
      
      // Update local state with saved data to ensure consistency
      if (data.success && data.data) {
        setSettings(data.data)
      }
      
      toast.success("Οι ρυθμίσεις αποθηκεύτηκαν επιτυχώς!")
      setHasChanges(false)
    } catch (error) {
      console.error('Settings save error:', error)
      toast.error("Σφάλμα κατά την αποθήκευση των ρυθμίσεων")
    } finally {
      setLoading(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm("Είστε σίγουρος ότι θέλετε να επαναφέρετε τις προεπιλεγμένες ρυθμίσεις;")) {
      // Reset to safe defaults
      setSettings(prev => ({
        ...prev,
        reminderHours: 24,
        sessionTimeout: 120,
        itemsPerPage: 20
      }))
      setHasChanges(true)
      toast.info("Οι ρυθμίσεις επαναφέρθηκαν στις προεπιλογές")
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A4A4A] mx-auto"></div>
          <p className="mt-2 text-slate-600 font-alegreya">Φόρτωση ρυθμίσεων...</p>
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
            Ρυθμίσεις Συστήματος
          </h1>
          <p className="text-slate-600 mt-1 font-alegreya">
            Διαχείριση λειτουργικών ρυθμίσεων και προτιμήσεων
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="font-alegreya"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Επαναφορά
          </Button>
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || loading}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Αποθήκευση..." : "Αποθήκευση"}
          </Button>
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

      {/* Maintenance Mode Warning */}
      {settings.maintenanceMode && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-alegreya text-red-800">
              <strong>Λειτουργία Συντήρησης Ενεργή:</strong> Οι νέες κρατήσεις είναι απενεργοποιημένες
            </span>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <TabsTrigger value="booking" className="font-alegreya">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Κρατήσεις</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="font-alegreya">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Τιμές</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-alegreya">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ειδοποιήσεις</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="font-alegreya">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Σύστημα</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="font-alegreya">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Κανάλια</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="font-alegreya">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ασφάλεια</span>
          </TabsTrigger>
        </TabsList>

        {/* Booking Rules */}
        <TabsContent value="booking">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Clock className="h-5 w-5 text-[#0A4A4A]" />
                  Ώρες Check-in/Check-out
                </CardTitle>
                <CardDescription className="font-alegreya">
                  Προεπιλεγμένες ώρες άφιξης και αναχώρησης
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="checkInTime" className="font-alegreya">Ώρα Check-in</Label>
                    <Input
                      id="checkInTime"
                      type="time"
                      value={settings.checkInTime}
                      onChange={(e) => updateSetting("checkInTime", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOutTime" className="font-alegreya">Ώρα Check-out</Label>
                    <Input
                      id="checkOutTime"
                      type="time"
                      value={settings.checkOutTime}
                      onChange={(e) => updateSetting("checkOutTime", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Calendar className="h-5 w-5 text-[#0A4A4A]" />
                  Πολιτικές Κράτησης
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="minAdvanceBooking" className="font-alegreya">
                      Ελάχιστες μέρες προκράτησης
                    </Label>
                    <Input
                      id="minAdvanceBooking"
                      type="number"
                      min="0"
                      value={settings.minAdvanceBooking}
                      onChange={(e) => updateSetting("minAdvanceBooking", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAdvanceBooking" className="font-alegreya">
                      Μέγιστες μέρες προκράτησης
                    </Label>
                    <Input
                      id="maxAdvanceBooking"
                      type="number"
                      min="1"
                      value={settings.maxAdvanceBooking}
                      onChange={(e) => updateSetting("maxAdvanceBooking", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cancellationPolicy" className="font-alegreya">
                      Δωρεάν ακύρωση (ώρες πριν)
                    </Label>
                    <Input
                      id="cancellationPolicy"
                      type="number"
                      min="0"
                      value={settings.cancellationPolicy}
                      onChange={(e) => updateSetting("cancellationPolicy", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="overbookingAllowed"
                    checked={settings.overbookingAllowed}
                    onChange={(e) => updateSetting("overbookingAllowed", e.target.checked)}
                  />
                  <Label htmlFor="overbookingAllowed" className="font-alegreya">
                    Επιτρέπεται υπερκράτηση (προσοχή!)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing & Payments */}
        <TabsContent value="pricing">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <CreditCard className="h-5 w-5 text-[#0A4A4A]" />
                  Τιμολόγηση & Εκπτώσεις
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="taxRate" className="font-alegreya">ΦΠΑ (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) => updateSetting("taxRate", parseFloat(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="directBookingDiscount" className="font-alegreya">
                      Έκπτωση άμεσης κράτησης (%)
                    </Label>
                    <Input
                      id="directBookingDiscount"
                      type="number"
                      min="0"
                      max="25"
                      value={settings.directBookingDiscount}
                      onChange={(e) => updateSetting("directBookingDiscount", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="automaticPricing"
                      checked={settings.automaticPricing}
                      onChange={(e) => updateSetting("automaticPricing", e.target.checked)}
                    />
                    <Label htmlFor="automaticPricing" className="font-alegreya">
                      Δυναμική τιμολόγηση
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cormorant">
                <Bell className="h-5 w-5 text-[#0A4A4A]" />
                Ρυθμίσεις Ειδοποιήσεων
              </CardTitle>
              <CardDescription className="font-alegreya">
                Διαχείριση αυτόματων ειδοποιήσεων και ενημερώσεων
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-cormorant font-semibold text-slate-800 mb-4">Γενικές Ειδοποιήσεις</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="font-alegreya">Email ειδοποιήσεις</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Αποστολή ειδοποιήσεων μέσω email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newBookingAlerts" className="font-alegreya">Ειδοποιήσεις νέων κρατήσεων</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Άμεση ενημέρωση για νέες κρατήσεις</p>
                    </div>
                    <Switch
                      id="newBookingAlerts"
                      checked={settings.newBookingAlerts}
                      onChange={(e) => updateSetting("newBookingAlerts", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lowInventoryAlerts" className="font-alegreya">Ειδοποιήσεις χαμηλής διαθεσιμότητας</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Όταν μένουν λίγα δωμάτια</p>
                    </div>
                    <Switch
                      id="lowInventoryAlerts"
                      checked={settings.lowInventoryAlerts}
                      onChange={(e) => updateSetting("lowInventoryAlerts", e.target.checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-cormorant font-semibold text-slate-800 mb-4">Ειδοποιήσεις Πελατών</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bookingConfirmations" className="font-alegreya">Επιβεβαίωση κράτησης</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Αυτόματη αποστολή επιβεβαίωσης</p>
                    </div>
                    <Switch
                      id="bookingConfirmations"
                      checked={settings.bookingConfirmations}
                      onChange={(e) => updateSetting("bookingConfirmations", e.target.checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminderNotifications" className="font-alegreya">Υπενθυμίσεις άφιξης</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Υπενθύμιση πριν την άφιξη</p>
                    </div>
                    <Switch
                      id="reminderNotifications"
                      checked={settings.reminderNotifications}
                      onChange={(e) => updateSetting("reminderNotifications", e.target.checked)}
                    />
                  </div>
                  
                  {settings.reminderNotifications && (
                    <div className="ml-6">
                      <Label htmlFor="reminderHours" className="font-alegreya">Ώρες πριν την άφιξη</Label>
                      <Input
                        id="reminderHours"
                        type="number"
                        min="1"
                        max="168"
                        value={settings.reminderHours}
                        onChange={(e) => updateSetting("reminderHours", parseInt(e.target.value))}
                        className="w-32 font-alegreya"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Preferences */}
        <TabsContent value="system">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Settings className="h-5 w-5 text-[#0A4A4A]" />
                  Προβολή Δεδομένων
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="itemsPerPage" className="font-alegreya">Εγγραφές ανά σελίδα</Label>
                    <Select
                      value={settings.itemsPerPage.toString()}
                      onValueChange={(value) => updateSetting("itemsPerPage", parseInt(value))}
                    >
                      <SelectTrigger className="font-alegreya">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Database className="h-5 w-5 text-[#0A4A4A]" />
                  Backup & Συντήρηση
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup" className="font-alegreya">Αυτόματο backup</Label>
                    <p className="text-xs text-slate-500 font-alegreya">Αυτόματη δημιουργία αντιγράφων ασφαλείας</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onChange={(e) => updateSetting("autoBackup", e.target.checked)}
                  />
                </div>
                
                {settings.autoBackup && (
                  <div>
                    <Label htmlFor="backupFrequency" className="font-alegreya">Συχνότητα backup</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => updateSetting("backupFrequency", value as 'daily' | 'weekly' | 'monthly')}
                    >
                      <SelectTrigger className="w-48 font-alegreya">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Καθημερινά</SelectItem>
                        <SelectItem value="weekly">Εβδομαδιαία</SelectItem>
                        <SelectItem value="monthly">Μηνιαία</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="font-alegreya">Λειτουργία συντήρησης</Label>
                    <p className="text-xs text-slate-500 font-alegreya">Απενεργοποίηση νέων κρατήσεων</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.maintenanceMode && (
                      <Badge className="bg-red-600 text-white font-alegreya">Ενεργό</Badge>
                    )}
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => updateSetting("maintenanceMode", e.target.checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Channel Management */}
        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-cormorant">
                <Globe className="h-5 w-5 text-[#0A4A4A]" />
                Διαχείριση Καναλιών Πώλησης
              </CardTitle>
              <CardDescription className="font-alegreya">
                Ενεργοποίηση και διαχείριση εξωτερικών πλατφορμών κρατήσεων
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="bookingComIntegration" className="font-alegreya font-semibold">Booking.com</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Συγχρονισμός με Booking.com</p>
                    </div>
                  </div>
                  <Switch
                    id="bookingComIntegration"
                    checked={settings.bookingComIntegration}
                    onChange={(e) => updateSetting("bookingComIntegration", e.target.checked)}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="airbnbIntegration" className="font-alegreya font-semibold">Airbnb</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Συγχρονισμός με Airbnb</p>
                    </div>
                  </div>
                  <Switch
                    id="airbnbIntegration"
                    checked={settings.airbnbIntegration}
                    onChange={(e) => updateSetting("airbnbIntegration", e.target.checked)}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="expediaIntegration" className="font-alegreya font-semibold">Expedia</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Συγχρονισμός με Expedia Group</p>
                    </div>
                  </div>
                  <Switch
                    id="expediaIntegration"
                    checked={settings.expediaIntegration}
                    onChange={(e) => updateSetting("expediaIntegration", e.target.checked)}
                    disabled
                  />
                </div>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium font-alegreya text-blue-800">Σημείωση</span>
                </div>
                <p className="text-sm text-blue-700 font-alegreya">
                  Για την ενεργοποίηση των καναλιών χρειάζονται τα διαπιστευτήρια API από κάθε πλατφόρμα. 
                  Επικοινωνήστε με τον διαχειριστή συστήματος.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Shield className="h-5 w-5 text-[#0A4A4A]" />
                  Ασφάλεια & Πρόσβαση
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout" className="font-alegreya">Χρόνος λήξης συνεδρίας (λεπτά)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="30"
                      max="480"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxConcurrentSessions" className="font-alegreya">Μέγιστες ταυτόχρονες συνεδρίες</Label>
                    <Input
                      id="maxConcurrentSessions"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.maxConcurrentSessions}
                      onChange={(e) => updateSetting("maxConcurrentSessions", parseInt(e.target.value))}
                      className="font-alegreya"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireTwoFA" className="font-alegreya">Αυθεντοποίηση δύο παραγόντων</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Επιπλέον ασφάλεια για διαχειριστές</p>
                    </div>
                    <Switch
                      id="requireTwoFA"
                      checked={settings.requireTwoFA}
                      onChange={(e) => updateSetting("requireTwoFA", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="passwordComplexity" className="font-alegreya">Απαιτήσεις πολυπλοκότητας κωδικού</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Ελάχιστα 8 χαρακτήρες, αριθμοί, σύμβολα</p>
                    </div>
                    <Switch
                      id="passwordComplexity"
                      checked={settings.passwordComplexity}
                      onChange={(e) => updateSetting("passwordComplexity", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auditLogging" className="font-alegreya">Καταγραφή ενεργειών</Label>
                      <p className="text-xs text-slate-500 font-alegreya">Αρχείο όλων των ενεργειών διαχειριστών</p>
                    </div>
                    <Switch
                      id="auditLogging"
                      checked={settings.auditLogging}
                      onChange={(e) => updateSetting("auditLogging", e.target.checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-cormorant">
                  <Key className="h-5 w-5 text-[#0A4A4A]" />
                  Κατάσταση Ασφαλείας
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium font-alegreya text-green-800">SSL Ασφάλεια</span>
                    </div>
                    <p className="text-sm text-green-700 font-alegreya">Ενεργοποιημένη</p>
                  </div>
                  
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium font-alegreya text-green-800">Backup Ενεργό</span>
                    </div>
                    <p className="text-sm text-green-700 font-alegreya">Τελευταίο: Σήμερα 03:00</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="font-alegreya">
                    <Database className="h-4 w-4 mr-2" />
                    Άμεσο Backup
                  </Button>
                  <Button variant="outline" className="font-alegreya">
                    <FileText className="h-4 w-4 mr-2" />
                    Αρχείο Δραστηριότητας
                  </Button>
                  <Button variant="outline" className="font-alegreya">
                    <Key className="h-4 w-4 mr-2" />
                    Ανανέωση API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
