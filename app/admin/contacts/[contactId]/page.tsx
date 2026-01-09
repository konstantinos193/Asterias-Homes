"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Calendar, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Reply, Trash2 } from "lucide-react"
import { useContact, useReplyToContact, useUpdateContactStatus, useCloseContact, useDeleteContact } from "@/hooks/api/use-contacts"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

const getStatusColor = (status: string) => {
  switch (status) {
    case "UNREAD":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "READ":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "REPLIED":
      return "bg-green-50 text-green-700 border-green-200"
    case "CLOSED":
      return "bg-slate-50 text-slate-700 border-slate-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "UNREAD":
      return "Μη αναγνωσμένο"
    case "READ":
      return "Αναγνωσμένο"
    case "REPLIED":
      return "Απαντημένο"
    case "CLOSED":
      return "Κλειστό"
    default:
      return status
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-50 text-red-700 border-red-200"
    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "LOW":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "Επείγον"
    case "HIGH":
      return "Υψηλό"
    case "MEDIUM":
      return "Μέτριο"
    case "LOW":
      return "Χαμηλό"
    default:
      return priority
  }
}

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.contactId as string
  const { toast } = useToast()
  
  const [replyMessage, setReplyMessage] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [priority, setPriority] = useState<string>("")

  const { data, isLoading, error } = useContact(contactId)
  const contact = data?.contact

  const replyToContact = useReplyToContact()
  const updateStatus = useUpdateContactStatus()
  const closeContact = useCloseContact()
  const deleteContact = useDeleteContact()

  // Initialize status and priority from contact data
  if (contact && !status && !priority) {
    setStatus(contact.status)
    setPriority(contact.priority)
  }

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Σφάλμα",
        description: "Παρακαλώ εισάγετε ένα μήνυμα απάντησης",
        variant: "destructive",
      })
      return
    }

    try {
      await replyToContact.mutateAsync({ id: contactId, message: replyMessage })
      toast({
        title: "Επιτυχία",
        description: "Η απάντηση στάλθηκε επιτυχώς",
      })
      setReplyMessage("")
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία αποστολής της απάντησης",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: contactId, status: newStatus })
      setStatus(newStatus)
      toast({
        title: "Επιτυχία",
        description: "Η κατάσταση ενημερώθηκε επιτυχώς",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης της κατάστασης",
        variant: "destructive",
      })
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await updateStatus.mutateAsync({ id: contactId, priority: newPriority })
      setPriority(newPriority)
      toast({
        title: "Επιτυχία",
        description: "Η προτεραιότητα ενημερώθηκε επιτυχώς",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία ενημέρωσης της προτεραιότητας",
        variant: "destructive",
      })
    }
  }

  const handleClose = async () => {
    try {
      await closeContact.mutateAsync(contactId)
      toast({
        title: "Επιτυχία",
        description: "Το μήνυμα έκλεισε επιτυχώς",
      })
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία κλεισίματος του μηνύματος",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteContact.mutateAsync(contactId)
      toast({
        title: "Επιτυχία",
        description: "Το μήνυμα διαγράφηκε επιτυχώς",
      })
      router.push("/admin/contacts")
    } catch (error) {
      toast({
        title: "Σφάλμα",
        description: "Αποτυχία διαγραφής του μηνύματος",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 font-alegreya">Φόρτωση μηνύματος...</div>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg font-alegreya">
        {error instanceof Error ? error.message : "Το μήνυμα δεν βρέθηκε"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/contacts" className="text-slate-500 hover:text-[#0A4A4A]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-cormorant font-light text-slate-800">{contact.subject}</h1>
            <Badge className={`${getStatusColor(contact.status)} border font-alegreya text-xs`}>
              {getStatusText(contact.status)}
            </Badge>
            <Badge className={`${getPriorityColor(contact.priority)} border font-alegreya text-xs`}>
              {getPriorityText(contact.priority)}
            </Badge>
          </div>
          <p className="text-slate-600 font-alegreya mt-1">
            Λήφθηκε στις {new Date(contact.createdAt).toLocaleDateString('el-GR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {contact.status !== 'CLOSED' && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="font-alegreya"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Κλείσιμο
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="font-alegreya text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Διαγραφή
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cormorant">Μήνυμα</CardTitle>
              <CardDescription className="font-alegreya">
                Από {contact.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none font-alegreya text-slate-700 whitespace-pre-wrap">
                {contact.message}
              </div>
            </CardContent>
          </Card>

          {/* Reply Section */}
          {contact.status !== 'CLOSED' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-cormorant flex items-center gap-2">
                  <Reply className="h-5 w-5" />
                  Απάντηση
                </CardTitle>
                <CardDescription className="font-alegreya">
                  Στείλτε απάντηση στο {contact.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Γράψτε την απάντησή σας..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="min-h-[150px] font-alegreya"
                />
                <Button
                  onClick={handleReply}
                  disabled={!replyMessage.trim() || replyToContact.isPending}
                  className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya"
                >
                  {replyToContact.isPending ? "Αποστολή..." : "Αποστολή Απάντησης"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Previous Reply */}
          {contact.response && (
            <Card>
              <CardHeader>
                <CardTitle className="font-cormorant flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Προηγούμενη Απάντηση
                </CardTitle>
                <CardDescription className="font-alegreya">
                  {contact.response.respondedBy?.name && `Από ${contact.response.respondedBy.name}`}
                  {contact.response.respondedAt && ` στις ${new Date(contact.response.respondedAt).toLocaleDateString('el-GR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none font-alegreya text-slate-700 whitespace-pre-wrap bg-green-50 p-4 rounded border border-green-200">
                  {contact.response.message}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cormorant">Στοιχεία Επικοινωνίας</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-900 font-alegreya">{contact.name}</div>
                    <div className="text-sm text-slate-600 font-alegreya">{contact.email}</div>
                  </div>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div className="text-sm text-slate-700 font-alegreya">{contact.phone}</div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-sm text-slate-700 font-alegreya">
                      {new Date(contact.createdAt).toLocaleDateString('el-GR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-slate-500 font-alegreya">
                      {new Date(contact.createdAt).toLocaleTimeString('el-GR', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="font-cormorant">Διαχείριση</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block font-alegreya">
                  Κατάσταση
                </label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="font-alegreya">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNREAD">Μη αναγνωσμένο</SelectItem>
                    <SelectItem value="READ">Αναγνωσμένο</SelectItem>
                    <SelectItem value="REPLIED">Απαντημένο</SelectItem>
                    <SelectItem value="CLOSED">Κλειστό</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block font-alegreya">
                  Προτεραιότητα
                </label>
                <Select value={priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="font-alegreya">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Χαμηλό</SelectItem>
                    <SelectItem value="MEDIUM">Μέτριο</SelectItem>
                    <SelectItem value="HIGH">Υψηλό</SelectItem>
                    <SelectItem value="URGENT">Επείγον</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cormorant">Επιβεβαίωση Διαγραφής</AlertDialogTitle>
            <AlertDialogDescription className="font-alegreya">
              Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μήνυμα; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-alegreya">Ακύρωση</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 font-alegreya"
            >
              Διαγραφή
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

