import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiRating from '@/libs/api/api-rating'
import { RatingCreateRequest } from '@/libs/dto/rating.dto'


export const useGetAllRatings = (limit?: number) => {
    return useQuery({
        queryKey: ['rating-all', limit ?? 10],
        queryFn: () => ApiRating._get_all_ratings(limit ?? 10)
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