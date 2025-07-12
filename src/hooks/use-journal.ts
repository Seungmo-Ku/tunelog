import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiJournal from '@/libs/api/api-journal'
import { JournalCreateRequest, JournalDeleteRequest, JournalResponse } from '@/libs/dto/journal.dto'
import { DataConnection } from '@/libs/dto/rating.dto'
import { isEmpty } from 'lodash'


export const useGetAllJournals = (limit: number = 10) => {
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-all', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiJournal._get_all_journals(limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}
export const useGetJournal = (id: string) => {
    return useQuery({
        queryKey: ['journal', id],
        queryFn: () => ApiJournal._get_journal(id)
    })
}
export const usePostJournal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (journal: JournalCreateRequest) => await ApiJournal._post_journal(journal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
        }
    })
}
export const useGetJournalsBySpotifyId = (spotifyId: string, limit: number = 10) => {
    return useInfiniteQuery<DataConnection<JournalResponse>, Error>({
        queryKey: ['journal-by-spotify-id', spotifyId, limit],
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
        mutationFn: async ({ id, journal }: { id: string, journal: JournalDeleteRequest }) => await ApiJournal._delete_journal(id, journal),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journal-all'] })
            queryClient.invalidateQueries({ queryKey: ['journal-by-spotify-id'] })
            queryClient.invalidateQueries({ queryKey: ['journal'] })
        }
    })
}