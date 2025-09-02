import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiAccount from '@/libs/api/api-account'
import { AccountLoginDto, AccountRegisterDto, AccountResponse } from '@/libs/dto/account.dto'
import { QueryClient } from '@tanstack/query-core'
import { DataConnection } from '@/libs/dto/rating.dto'
import { isEmpty } from 'lodash'
import { useAccount } from '@/libs/utils/account'


const invalidateQueries = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['me'] })
}

export const useGetMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => ApiAccount._get_me()
    })
}
export const useHandleLogin = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (account: AccountLoginDto) => await ApiAccount._handle_login(account),
        onSuccess: (data) => {
            if (data.status === 200) {
                invalidateQueries(queryClient)
            }
        }
    })
}
export const useHandleRegister = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (account: AccountRegisterDto) => await ApiAccount._handle_register(account),
        onSuccess: (data) => {
            if (data.status === 201) {
                invalidateQueries(queryClient)
            }
        }
    })
}
export const useHandleLogout = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => await ApiAccount._handle_logout(),
        onSuccess: () => {
            invalidateQueries(queryClient)
        }
    })
}
export const useGetMyObjectCount = () => {
    const { status, me } = useAccount()
    return useQuery({
        queryKey: ['my-object-count', status, me?._id ?? ''],
        queryFn: () => ApiAccount._get_my_object_count()
    })
}
export const useGetOthersObjectCount = (id: string) => {
    const { status, me } = useAccount()
    return useQuery({
        queryKey: ['others-object-count', id, status, me?._id ?? ''],
        queryFn: () => ApiAccount._get_others_object_count(id),
        enabled: !!id
    })
}
export const useGetUserFollowing = (id: string, limit: number = 10) => {
    return useInfiniteQuery<DataConnection<AccountResponse>, Error>({
        queryKey: ['user-following', id, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiAccount._get_user_following(id, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !isEmpty(id)
    })
}
export const useGetUserFollower = (id: string, limit: number = 10) => {
    return useInfiniteQuery<DataConnection<AccountResponse>, Error>({
        queryKey: ['user-follower', id, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiAccount._get_user_follower(id, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !isEmpty(id)
    })
}
export const useGetUserById = (id: string | undefined) => {
    return useQuery({
        queryKey: ['user-by-id', id],
        queryFn: () => ApiAccount._get_user_by_id(id!),
        enabled: !isEmpty(id)
    })
}
export const useFollowUser = (id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => await ApiAccount._follow_user(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-following'] })
            queryClient.invalidateQueries({ queryKey: ['user-follower'] })
            queryClient.invalidateQueries({ queryKey: ['me'] })
            queryClient.invalidateQueries({ queryKey: ['user-by-id', id] })
        }
    })
}
export const useUnfollowUser = (id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => await ApiAccount._unfollow_user(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-following'] })
            queryClient.invalidateQueries({ queryKey: ['user-follower'] })
            queryClient.invalidateQueries({ queryKey: ['me'] })
            queryClient.invalidateQueries({ queryKey: ['user-by-id', id] })
        }
    })
}
export const useGetNotify = () => {
    const { status, me } = useAccount()
    return useQuery({
        queryKey: ['user-notify', status, me?._id ?? ''],
        queryFn: () => ApiAccount._get_notify()
    })
}
export const useCheckNotify = (id: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => ApiAccount._check_notify(id),
        onSuccess: () => {
            invalidateQueries(queryClient)
        }
    })
}