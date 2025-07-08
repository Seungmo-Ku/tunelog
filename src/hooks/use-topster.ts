import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TopsterCreateRequest, TopsterResponse } from '@/libs/dto/topster.dto'
import ApiTopster from '@/libs/api/api-topster'
import { DataConnection } from '@/libs/dto/rating.dto'


export const useGetAllTopsters = (limit: number = 10) => {
    return useInfiniteQuery<DataConnection<TopsterResponse>, Error>({
        queryKey: ['topster-all', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiTopster._get_all_topsters(limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}
export const useGetTopster = (id: string) => {
    return useQuery({
        queryKey: ['topster', id],
        queryFn: () => ApiTopster._get_topster(id)
    })
}
export const usePostTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (topster: TopsterCreateRequest) => await ApiTopster._post_topster(topster),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
        }
    })
}