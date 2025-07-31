import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TopsterCreateRequest, TopsterResponse, TopsterUpdateRequest } from '@/libs/dto/topster.dto'
import ApiTopster from '@/libs/api/api-topster'
import { DataConnection } from '@/libs/dto/rating.dto'
import { useAccount } from '@/libs/utils/account'


export const useGetMyTopsters = (limit: number = 10, enabled: boolean = true) => {
    const { status, me } = useAccount()
    return useInfiniteQuery<DataConnection<TopsterResponse>, Error>({
        queryKey: ['topster-my', status, me?._id ?? '', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiTopster._get_my_topsters(limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: enabled
    })
}
export const useGetTopster = (id: string) => {
    const { status, me } = useAccount()
    return useQuery({
        queryKey: ['topster', status, me?._id ?? '', id],
        queryFn: () => ApiTopster._get_topster(id)
    })
}
export const usePostTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (topster: TopsterCreateRequest) => await ApiTopster._post_topster(topster),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
            queryClient.invalidateQueries({ queryKey: ['topster-my'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useDeleteTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiTopster._delete_topster(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
            queryClient.invalidateQueries({ queryKey: ['topster'] })
            queryClient.invalidateQueries({ queryKey: ['topster-my'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useUpdateTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, topster }: { id: string, topster: TopsterUpdateRequest }) => await ApiTopster._update_topster(id, topster),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
            queryClient.invalidateQueries({ queryKey: ['topster'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useLikeTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiTopster._like_topster(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
            queryClient.invalidateQueries({ queryKey: ['topster'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useUnlikeTopster = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => await ApiTopster._unlike_topster(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topster-all'] })
            queryClient.invalidateQueries({ queryKey: ['topster'] })
            queryClient.invalidateQueries({ queryKey: ['community-all'] })
        }
    })
}
export const useGetUserTopsters = (id: string, limit: number = 10, enabled: boolean = true) => {
    return useInfiniteQuery<DataConnection<TopsterResponse>, Error>({
        queryKey: ['topster-user', id, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiTopster._get_user_topsters(id, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: enabled
    })
}