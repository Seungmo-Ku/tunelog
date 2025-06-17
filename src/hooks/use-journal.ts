import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiJournal from '@/libs/api/api-journal'
import { JournalCreateRequest } from '@/libs/dto/journal.dto'


export const useGetAllJournals = (limit?: number) => {
    return useQuery({
        queryKey: ['journal-all', limit ?? 10],
        queryFn: () => ApiJournal._get_all_journals(limit ?? 10)
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