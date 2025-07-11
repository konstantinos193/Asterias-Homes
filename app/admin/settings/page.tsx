"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Building,
  Mail,
  Phone,
  Globe,
  Clock,
  Calendar,
  Bell,
  Users,
  Settings,
  Database,
  Save,
  Plus,
  Trash2,
} from "lucide-react"

// Mock settings data
const settingsData = {
  general: {
    hotelName: "Asterias Hotel",
    address: "Κορωνησία, Άρτα, Ελλάδα",
    postalCode: "48100",
    email: "info@hotelkoronisia.gr",
    phone: "+30 XXX XXX XXXX",
    website: "www.hotelkoronisia.gr",
    description:
      "Παραδοσιακά δωμάτια στην Κορωνησία Άρτας, στην καρδιά του Αμβρακικού Κόλπου. Βρείτε γαλήνη και επαφή με τη φύση.",
  },
  booking: {
    checkInTime: "15:00",
    checkOutTime: "11:00",
    minAdvanceBooking: "1",
    maxAdvanceBooking: "365",
    cancellationPeriod: "48",
    depositRequired: true,
    depositAmount: "30",
    taxRate: "13",
    currency: "EUR",
  },
  notifications: {
    bookingConfirmation: true,
    bookingReminder: true,
    reminderHours: "24",
    checkInNotification: true,
    reviewRequest: true,
    reviewRequestDelay: "2",
    adminNewBooking: true,
    adminCancellation: true,
  },
  users: [
    {
      id: "1",
      name: "Διαχειριστής",
      email: "admin@hotelkoronisia.gr",
      role: "admin",
      lastLogin: "2024-01-20 14:30",
    },
    {
      id: "2",
      name: "Μαρία Παπαδοπούλου",
      email: "maria@hotelkoronisia.gr",
      role: "manager",
      lastLogin: "2024-01-19 09:15",
    },
    {
      id: "3",
      name: "Γιώργος Δημητρίου",
      email: "giorgos@hotelkoronisia.gr",
      role: "staff",
      lastLogin: "2024-01-20 08:45",
    },
  ],
  system: {
    language: "el",
    timezone: "Europe/Athens",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24",
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({ ...settingsData })
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "staff" })
  const [activeTab, setActiveTab] = useState("general")

  const handleGeneralChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value,
      },
    }))
  }

  const handleBookingChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      booking: {
        ...prev.booking,
        [field]: value,
      },
    }))
  }

  const handleNotificationsChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }))
  }

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        [field]: value,
      },
    }))
  }

  const handleNewUserChange = (field: string, value: string) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const newId = (Math.max(...settings.users.map((user) => Number.parseInt(user.id))) + 1).toString()
      setSettings((prev) => ({
        ...prev,
        users: [
          ...prev.users,
          {
            id: newId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            lastLogin: "-",
          },
        ],
      }))
      setNewUser({ name: "", email: "", role: "staff" })
    }
  }

  const handleRemoveUser = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== id),
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, you would save the settings to the database
    console.log("Saving settings:", settings)
    alert("Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία!")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-cormorant font-light text-slate-800">Ρυθμίσεις</h1>
          <p className="text-slate-600 font-alegreya">Διαχείριση ρυθμίσεων συστήματος</p>
        </div>
        <div>
          <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya" onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Αποθήκευση Ρυθμίσεων
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="general" className="font-alegreya">
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Γενικές</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="font-alegreya">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Κρατήσεις</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-alegreya">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Ειδοποιήσεις</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="font-alegreya">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Χρήστες</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="font-alegreya">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Σύστημα</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Γενικές Πληροφορίες</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Όνομα Ξενοδοχείου
                  </label>
                  <Input
                    value={settings.general.hotelName}
                    onChange={(e) => handleGeneralChange("hotelName", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Διεύθυνση</label>
                  <Input
                    value={settings.general.address}
                    onChange={(e) => handleGeneralChange("address", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Ταχυδρομικός Κώδικας
                  </label>
                  <Input
                    value={settings.general.postalCode}
                    onChange={(e) => handleGeneralChange("postalCode", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-slate-400" />
                    <Input
                      value={settings.general.email}
                      onChange={(e) => handleGeneralChange("email", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Τηλέφωνο</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" />
                    <Input
                      value={settings.general.phone}
                      onChange={(e) => handleGeneralChange("phone", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ιστοσελίδα</label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-slate-400" />
                    <Input
                      value={settings.general.website}
                      onChange={(e) => handleGeneralChange("website", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Περιγραφή</label>
                  <Textarea
                    value={settings.general.description}
                    onChange={(e) => handleGeneralChange("description", e.target.value)}
                    className="font-alegreya"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Booking Settings */}
        <TabsContent value="booking" className="space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ρυθμίσεις Κρατήσεων</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ώρα Check-in</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    <Input
                      type="time"
                      value={settings.booking.checkInTime}
                      onChange={(e) => handleBookingChange("checkInTime", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ώρα Check-out</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    <Input
                      type="time"
                      value={settings.booking.checkOutTime}
                      onChange={(e) => handleBookingChange("checkOutTime", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Ελάχιστες Ημέρες Προκράτησης
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.booking.minAdvanceBooking}
                    onChange={(e) => handleBookingChange("minAdvanceBooking", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Μέγιστες Ημέρες Προκράτησης
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={settings.booking.maxAdvanceBooking}
                    onChange={(e) => handleBookingChange("maxAdvanceBooking", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Περίοδος Δωρεάν Ακύρωσης (ώρες)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.booking.cancellationPeriod}
                    onChange={(e) => handleBookingChange("cancellationPeriod", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Νόμισμα</label>
                  <Select
                    value={settings.booking.currency}
                    onValueChange={(value) => handleBookingChange("currency", value)}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε νόμισμα" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Ευρώ (€)</SelectItem>
                      <SelectItem value="USD">Δολάριο ΗΠΑ ($)</SelectItem>
                      <SelectItem value="GBP">Λίρα Αγγλίας (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Ποσοστό Φόρου (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.booking.taxRate}
                    onChange={(e) => handleBookingChange("taxRate", e.target.value)}
                    className="font-alegreya"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="deposit-required"
                    checked={settings.booking.depositRequired}
                    onCheckedChange={(checked) => handleBookingChange("depositRequired", checked)}
                  />
                  <Label htmlFor="deposit-required" className="font-alegreya">
                    Απαιτείται Προκαταβολή
                  </Label>
                </div>
                {settings.booking.depositRequired && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                      Ποσοστό Προκαταβολής (%)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.booking.depositAmount}
                      onChange={(e) => handleBookingChange("depositAmount", e.target.value)}
                      className="font-alegreya"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ρυθμίσεις Ειδοποιήσεων</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <h3 className="text-md font-cormorant font-semibold text-slate-800">Ειδοποιήσεις Πελατών</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="booking-confirmation"
                      checked={settings.notifications.bookingConfirmation}
                      onCheckedChange={(checked) => handleNotificationsChange("bookingConfirmation", checked)}
                    />
                    <Label htmlFor="booking-confirmation" className="font-alegreya">
                      Επιβεβαίωση Κράτησης
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="booking-reminder"
                      checked={settings.notifications.bookingReminder}
                      onCheckedChange={(checked) => handleNotificationsChange("bookingReminder", checked)}
                    />
                    <Label htmlFor="booking-reminder" className="font-alegreya">
                      Υπενθύμιση Κράτησης
                    </Label>
                  </div>
                  {settings.notifications.bookingReminder && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                        Ώρες Πριν την Άφιξη
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={settings.notifications.reminderHours}
                        onChange={(e) => handleNotificationsChange("reminderHours", e.target.value)}
                        className="font-alegreya"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="check-in-notification"
                      checked={settings.notifications.checkInNotification}
                      onCheckedChange={(checked) => handleNotificationsChange("checkInNotification", checked)}
                    />
                    <Label htmlFor="check-in-notification" className="font-alegreya">
                      Ειδοποίηση Check-in
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="review-request"
                      checked={settings.notifications.reviewRequest}
                      onCheckedChange={(checked) => handleNotificationsChange("reviewRequest", checked)}
                    />
                    <Label htmlFor="review-request" className="font-alegreya">
                      Αίτημα Αξιολόγησης
                    </Label>
                  </div>
                  {settings.notifications.reviewRequest && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                        Ημέρες Μετά το Check-out
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={settings.notifications.reviewRequestDelay}
                        onChange={(e) => handleNotificationsChange("reviewRequestDelay", e.target.value)}
                        className="font-alegreya"
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-md font-cormorant font-semibold text-slate-800 mt-8">Ειδοποιήσεις Διαχειριστών</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="admin-new-booking"
                      checked={settings.notifications.adminNewBooking}
                      onCheckedChange={(checked) => handleNotificationsChange("adminNewBooking", checked)}
                    />
                    <Label htmlFor="admin-new-booking" className="font-alegreya">
                      Νέα Κράτηση
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="admin-cancellation"
                      checked={settings.notifications.adminCancellation}
                      onCheckedChange={(checked) => handleNotificationsChange("adminCancellation", checked)}
                    />
                    <Label htmlFor="admin-cancellation" className="font-alegreya">
                      Ακύρωση Κράτησης
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Διαχείριση Χρηστών</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Όνομα</label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => handleNewUserChange("name", e.target.value)}
                      className="font-alegreya"
                      placeholder="Όνομα χρήστη"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Email</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => handleNewUserChange("email", e.target.value)}
                      className="font-alegreya"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ρόλος</label>
                    <Select value={newUser.role} onValueChange={(value) => handleNewUserChange("role", value)}>
                      <SelectTrigger className="font-alegreya">
                        <SelectValue placeholder="Επιλέξτε ρόλο" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Διαχειριστής</SelectItem>
                        <SelectItem value="manager">Διευθυντής</SelectItem>
                        <SelectItem value="staff">Προσωπικό</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya" onClick={handleAddUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Προσθήκη Χρήστη
                </Button>

                <div className="mt-8">
                  <h3 className="text-md font-cormorant font-semibold text-slate-800 mb-4">Υπάρχοντες Χρήστες</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                          >
                            Όνομα
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                          >
                            Ρόλος
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                          >
                            Τελευταία Σύνδεση
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider font-alegreya"
                          >
                            Ενέργειες
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {settings.users.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-alegreya">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-purple-50 text-purple-700"
                                    : user.role === "manager"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-green-50 text-green-700"
                                }`}
                              >
                                {user.role === "admin"
                                  ? "Διαχειριστής"
                                  : user.role === "manager"
                                    ? "Διευθυντής"
                                    : "Προσωπικό"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-alegreya">
                              {user.lastLogin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {user.id !== "1" && (
                                <button
                                  onClick={() => handleRemoveUser(user.id)}
                                  className="text-red-600 hover:text-red-900 font-alegreya"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <div className="bg-white rounded-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-cormorant font-semibold text-slate-800">Ρυθμίσεις Συστήματος</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Γλώσσα</label>
                  <Select
                    value={settings.system.language}
                    onValueChange={(value) => handleSystemChange("language", value)}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε γλώσσα" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="el">Ελληνικά</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Ζώνη Ώρας</label>
                  <Select
                    value={settings.system.timezone}
                    onValueChange={(value) => handleSystemChange("timezone", value)}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε ζώνη ώρας" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Athens">Αθήνα (GMT+3)</SelectItem>
                      <SelectItem value="Europe/London">Λονδίνο (GMT+1)</SelectItem>
                      <SelectItem value="Europe/Berlin">Βερολίνο (GMT+2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">
                    Μορφή Ημερομηνίας
                  </label>
                  <Select
                    value={settings.system.dateFormat}
                    onValueChange={(value) => handleSystemChange("dateFormat", value)}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε μορφή ημερομηνίας" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Μορφή Ώρας</label>
                  <Select
                    value={settings.system.timeFormat}
                    onValueChange={(value) => handleSystemChange("timeFormat", value)}
                  >
                    <SelectTrigger className="font-alegreya">
                      <SelectValue placeholder="Επιλέξτε μορφή ώρας" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12-ωρη (AM/PM)</SelectItem>
                      <SelectItem value="24">24-ωρη</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-backup"
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => handleSystemChange("autoBackup", checked)}
                  />
                  <Label htmlFor="auto-backup" className="font-alegreya">
                    Αυτόματο Backup
                  </Label>
                </div>
                {settings.system.autoBackup && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 font-alegreya mb-1">Συχνότητα</label>
                    <Select
                      value={settings.system.backupFrequency}
                      onValueChange={(value) => handleSystemChange("backupFrequency", value)}
                    >
                      <SelectTrigger className="font-alegreya">
                        <SelectValue placeholder="Επιλέξτε συχνότητα" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Καθημερινά</SelectItem>
                        <SelectItem value="weekly">Εβδομαδιαία</SelectItem>
                        <SelectItem value="monthly">Μηνιαία</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenance-mode"
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) => handleSystemChange("maintenanceMode", checked)}
                  />
                  <Label htmlFor="maintenance-mode" className="font-alegreya">
                    Λειτουργία Συντήρησης
                  </Label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-md font-cormorant font-semibold text-slate-800 mb-4">Διαχείριση Βάσης Δεδομένων</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="font-alegreya">
                    <Database className="h-4 w-4 mr-2" />
                    Δημιουργία Backup
                  </Button>
                  <Button variant="outline" className="font-alegreya">
                    Επαναφορά από Backup
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 font-alegreya">
                    Εκκαθάριση Δεδομένων
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
