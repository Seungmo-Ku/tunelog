import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiRating from '@/libs/api/api-rating'
import { DataConnection, RatingCreateRequest, RatingDeleteRequest, RatingResponse } from '@/libs/dto/rating.dto'
import { isEmpty } from 'lodash'


export const useGetAllRatings = (limit: number = 10) => {
    return useInfiniteQuery<DataConnection<RatingResponse>, Error>({
        queryKey: ['rating-all', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiRating._get_all_ratings(limit, cursor) ?? { data: [], nextCursor: undefined }
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
        }
    })
}