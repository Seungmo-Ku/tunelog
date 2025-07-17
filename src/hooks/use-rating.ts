import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiRating from '@/libs/api/api-rating'
import { DataConnection, RatingCreateRequest, RatingDeleteRequest, RatingResponse } from '@/libs/dto/rating.dto'
import { isEmpty } from 'lodash'
import { RatingQueryType, RatingSortType } from '@/libs/constants/rating.constant'
import { useAccount } from '@/libs/utils/account'


export const useGetAllPublicRatings = (limit: number = 10, type: RatingQueryType = 'all', sort: RatingSortType = 'newest') => {
    return useInfiniteQuery<DataConnection<RatingResponse>, Error>({
        queryKey: ['rating-all', limit, type, sort],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiRating._get_all_public_ratings(limit, type, sort, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}
export const useGetMyRatings = (limit: number = 10, type: RatingQueryType = 'all', sort: RatingSortType = 'newest') => {
    const { status, me } = useAccount()
    return useInfiniteQuery<DataConnection<RatingResponse>, Error>({
        queryKey: ['rating-my', status, me?._id ?? '', limit, type, sort],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiRating._get_my_ratings(limit, type, sort, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })
}
export const usePostRating = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (rating: RatingCreateRequest) => await ApiRating._post_rating(rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rating-all'] })
            queryClient.invalidateQueries({ queryKey: ['rating-my'] })
            queryClient.invalidateQueries({ queryKey: ['rating-by-spotify-id'] })
        }
    })
}
export const useGetRatingsBySpotifyId = (spotifyId: string, limit: number = 10) => {
    return useInfiniteQuery<DataConnection<RatingResponse>, Error>({
        queryKey: ['rating-by-spotify-id', spotifyId, limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiRating._get_ratings_by_spotify_id(spotifyId, limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: !isEmpty(spotifyId)
    })
}
export const useDeleteRating = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, rating }: { id: string, rating: RatingDeleteRequest }) => await ApiRating._delete_rating(id, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rating-all'] })
            queryClient.invalidateQueries({ queryKey: ['rating-my'] })
            queryClient.invalidateQueries({ queryKey: ['rating-by-spotify-id'] })
        }
    })
}