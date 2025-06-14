import { useQuery } from '@tanstack/react-query'
import ApiJournal from '@/libs/api/api-journal'


export const useGetAllJournals = (limit?: number) => {
    return useQuery({
        queryKey: ['journal-all', limit ?? 10],
        queryFn: () => ApiJournal._get_all_journals(limit ?? 10)
    })
}