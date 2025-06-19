import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiJournal from '@/libs/api/api-journal'
import { JournalCreateRequest, JournalResponse } from '@/libs/dto/journal.dto'
import { DataConnection } from '@/libs/dto/rating.dto'


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