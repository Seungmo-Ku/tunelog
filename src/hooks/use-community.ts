import { useInfiniteQuery } from '@tanstack/react-query'
import { DataConnection } from '@/libs/dto/rating.dto'
import { CommunityQueryType, CommunitySortType } from '@/libs/constants/community.constant'
import ApiCommunity from '@/libs/api/api-community'
import { CommunityResponse } from '@/libs/dto/community.dto'


export const useGetCommunityItems = (limit: number = 10, type: CommunityQueryType = 'all', sort: CommunitySortType = 'newest') => {
    return useInfiniteQuery<DataConnection<CommunityResponse>, Error>({
        queryKey: ['community-all', limit, type, sort],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiCommunity._get_community_items(limit, type, sort, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}