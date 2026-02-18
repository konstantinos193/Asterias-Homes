// React Query hooks for offers
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { Offer } from '@/types/offers'

// Re-export Offer type for convenience
export type { Offer }

// Helper function to normalize offer data from backend
function normalizeOffer(data: any): Offer | null {
  console.log('🔧 normalizeOffer: Input data:', data)
  
  if (!data) {
    console.log('🔧 normalizeOffer: No data provided')
    return null
  }
  
  // Handle response structure - backend might return { offer: {...} } or direct object
  let offer: any
  if (data && typeof data === 'object' && 'offer' in data) {
    offer = data.offer
  } else {
    offer = data
  }
  
  console.log('🔧 normalizeOffer: Extracted offer:', offer)
  
  if (!offer || typeof offer !== 'object') {
    console.log('🔧 normalizeOffer: Invalid offer object')
    return null
  }
  
  // Ensure id is set from _id
  const normalized = {
    ...offer,
    id: offer.id || offer._id,
  }
  
  console.log('🔧 normalizeOffer: Normalized result:', normalized)
  return normalized
}

export function useOffers(): UseQueryResult<Offer[], Error> {
  return useQuery<Offer[], Error>({
    queryKey: ['offers'],
    queryFn: async () => {
      const data = await api.offers.getAll()
      // Handle both response formats: { offers: [] } or []
      let offersArray: any[]
      if (Array.isArray(data)) {
        offersArray = data
      } else if (data && typeof data === 'object' && 'offers' in data && Array.isArray((data as any).offers)) {
        offersArray = (data as any).offers
      } else {
        return []
      }
      
      // Normalize each offer and filter out nulls
      return offersArray.map(normalizeOffer).filter((offer): offer is Offer => offer !== null)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOffer(
  offerId: string | null | undefined,
  options?: {
    initialData?: Offer | null
    enabled?: boolean
  }
): UseQueryResult<Offer, Error> {
  return useQuery<Offer, Error>({
    queryKey: ['offers', offerId],
    queryFn: async () => {
      if (!offerId) throw new Error('Offer ID is required')
      const data = await api.offers.getById(offerId)
      const normalized = normalizeOffer(data)
      if (!normalized) {
        throw new Error('Offer not found')
      }
      return normalized
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!offerId,
    initialData: options?.initialData ? normalizeOffer(options.initialData) || undefined : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminOffers(): UseQueryResult<Offer[], Error> {
  return useQuery<Offer[], Error>({
    queryKey: ['admin', 'offers'],
    queryFn: async () => {
      console.log('🔧 useAdminOffers: Fetching offers from /api/admin/offers')
      const response = await api.offers.getAllAdmin()
      console.log('🔧 useAdminOffers: Raw response:', response)
      
      // Handle nested response structure: { data: { offers: [] } }
      let offersArray: any[]
      if (response && 
          typeof response === 'object' && 
          'data' in response && 
          response.data && 
          typeof response.data === 'object' && 
          'offers' in response.data &&
          Array.isArray((response.data as any).offers)) {
        offersArray = (response.data as any).offers
        console.log('🔧 useAdminOffers: Found offers in response.data.offers')
      } else if (Array.isArray(response)) {
        offersArray = response
        console.log('🔧 useAdminOffers: Found offers as direct array')
      } else if (response && typeof response === 'object' && 'offers' in response && Array.isArray(response.offers)) {
        offersArray = response.offers
        console.log('🔧 useAdminOffers: Found offers in response.offers')
      } else {
        console.log('🔧 useAdminOffers: No offers found in response, returning empty array')
        console.log('🔧 useAdminOffers: Response structure:', {
          hasData: response && typeof response === 'object' && 'data' in response,
          dataType: response && typeof response === 'object' && 'data' in response ? typeof (response as any).data : 'undefined',
          hasOffersInData: response && typeof response === 'object' && 'data' in response && (response as any).data && 'offers' in (response as any).data,
          offersType: response && typeof response === 'object' && 'data' in response && (response as any).data ? typeof (response as any).data.offers : 'undefined',
          isArray: response && typeof response === 'object' && 'data' in response && (response as any).data ? Array.isArray((response as any).data?.offers) : false
        })
        return []
      }
      
      console.log('🔧 useAdminOffers: Offers array:', offersArray)
      
      // Normalize each offer and filter out nulls
      const normalizedOffers = offersArray.map(normalizeOffer).filter((offer): offer is Offer => offer !== null)
      console.log('🔧 useAdminOffers: Normalized offers:', normalizedOffers)
      
      return normalizedOffers
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useCreateOffer(): UseMutationResult<Offer, Error, unknown> {
  const queryClient = useQueryClient()
  
  return useMutation<Offer, Error, unknown>({
    mutationFn: async (offerData: unknown) => {
      const data = await api.offers.create(offerData)
      const normalized = normalizeOffer(data)
      if (!normalized) {
        throw new Error('Failed to create offer')
      }
      return normalized
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}

export function useUpdateOffer(): UseMutationResult<Offer, Error, { id: string; data: unknown }> {
  const queryClient = useQueryClient()
  
  return useMutation<Offer, Error, { id: string; data: unknown }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.offers.update(id, data)
      const normalized = normalizeOffer(response)
      if (!normalized) {
        throw new Error('Failed to update offer')
      }
      return normalized
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers', variables.id] })
    },
  })
}

export function useDeleteOffer(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await api.offers.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}

export function useToggleOffer(): UseMutationResult<Offer, Error, string> {
  const queryClient = useQueryClient()
  
  return useMutation<Offer, Error, string>({
    mutationFn: async (id: string) => {
      const data = await api.offers.toggle(id)
      const normalized = normalizeOffer(data)
      if (!normalized) {
        throw new Error('Failed to toggle offer')
      }
      return normalized
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })
}

