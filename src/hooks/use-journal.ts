import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiJournal from '@/libs/api/api-journal'
import { JournalCreateRequest, JournalResponse, JournalUpdateRequest } from '@/libs/dto/journal.dto'
import { DataConnection } from '@/libs/dto/rating.dto'
import { isEmpty } from 'lodash'
import { useAccount } from '@/libs/utils/account'


export const useGetAllPublicJournals = (limit: number = 10, sort: 'newest' | 'likes' = 'newest') => {
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-all', limit, sort],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiJournal._get_all_public_journals(limit, sort, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}
export const useGetMyJournals = (limit: number = 10, enabled: boolean = true) => {
    const { status, me } = useAccount()
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-my', status, me?._id ?? '', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiJournal._get_my_journals(limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: enabled
    })
}
export const useGetJournal = (id: string | undefined) => {
    const { status, me } = useAccount()
    return useQuery({
        queryKey: ['journal', status, me?._id ?? '', id],
        queryFn: () => ApiJournal._get_journal(id!),
        enabled: !isEmpty(id),
    })
}
export const usePostJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (journal: JournalCreateRequest) => await ApiJournal._post_journal(journal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-my'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useGetJournalsBySpotifyId = (spotifyId: string, limit: number = 10) => {
    const { status, me } = useAccount()
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-by-spotify-id', status, me?._id ?? '', spotifyId, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiJournal._get_journals_by_spotify_id(spotifyId, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !isEmpty(spotifyId)
    })
}
export const useDeleteJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiJournal._delete_journal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['journal'] })
            queryClient.invalidateQueries({ queryKey: ['journal-my'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useUpdateJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, journal }: { id: string, journal: JournalUpdateRequest }) => await ApiJournal._update_journal(id, journal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['journal'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useLikeJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiJournal._like_journal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal'] })
        }
    })
}
export const useUnlikeJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiJournal._unlike_journal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal'] })
        }
    })
}
export const useGetUserJournals = (id: string, limit: number = 10, enabled: boolean = true) => {
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-user', id, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiJournal._get_user_journals(id, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: enabled && !isEmpty(id)
    })
}