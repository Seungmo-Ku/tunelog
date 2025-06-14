import { useQuery } from '@tanstack/react-query'
import ApiRating from '@/libs/api/api-rating'


export const useGetAllRatings = (limit?: number) => {
    return useQuery({
        queryKey: ['rating-all', limit ?? 10],
        queryFn: () => ApiRating._get_all_ratings(limit ?? 10)
    })
}