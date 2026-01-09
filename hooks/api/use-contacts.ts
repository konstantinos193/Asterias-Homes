// React Query hooks for contact management
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export interface Contact {
  _id: string
  id?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedTo?: {
    _id: string
    name: string
    email: string
  }
  response?: {
    message: string
    respondedBy?: {
      _id: string
      name: string
    }
    respondedAt: string
  }
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ContactsResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ContactStats {
  total: number
  unread: number
  read: number
  replied: number
  closed: number
  todayContacts: number
  priorityBreakdown: {
    LOW?: number
    MEDIUM?: number
    HIGH?: number
    URGENT?: number
  }
  monthlyContacts: Array<{
    _id: string
    count: number
  }>
}

export function useContacts(params?: {
  status?: string
  priority?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: string
}): UseQueryResult<ContactsResponse, Error> {
  return useQuery<ContactsResponse, Error>({
    queryKey: ['contacts', params],
    queryFn: async () => {
      const data = await api.contact.getAll(params)
      // Normalize response structure
      if (data && typeof data === 'object' && 'contacts' in data) {
        return data as ContactsResponse
      }
      // If response is just an array, wrap it
      if (Array.isArray(data)) {
        return {
          contacts: data,
          pagination: {
            page: 1,
            limit: data.length,
            total: data.length,
            pages: 1,
          },
        }
      }
      return {
        contacts: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useContact(contactId: string | null | undefined): UseQueryResult<{ contact: Contact }, Error> {
  return useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => {
      if (!contactId) throw new Error('Contact ID is required')
      return api.contact.getById(contactId) as Promise<{ contact: Contact }>
    },
    enabled: !!contactId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useContactStats(): UseQueryResult<ContactStats, Error> {
  return useQuery({
    queryKey: ['contacts', 'stats'],
    queryFn: () => api.contact.getStats() as Promise<ContactStats>,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUpdateContactStatus(): UseMutationResult<{ contact: Contact }, Error, { id: string; status?: string; priority?: string; assignedTo?: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => api.contact.updateStatus(id, data) as Promise<{ contact: Contact }>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export function useReplyToContact(): UseMutationResult<{ contact: Contact }, Error, { id: string; message: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, message }) => api.contact.reply(id, message) as Promise<{ contact: Contact }>,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contact', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export function useMarkContactAsRead(): UseMutationResult<{ contact: Contact }, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.contact.markAsRead(id) as Promise<{ contact: Contact }>,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contact', id] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export function useCloseContact(): UseMutationResult<{ contact: Contact }, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.contact.close(id) as Promise<{ contact: Contact }>,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contact', id] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

export function useDeleteContact(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.contact.delete(id) as Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      queryClient.invalidateQueries({ queryKey: ['contacts', 'stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })
}

