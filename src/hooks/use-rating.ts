import { useQuery } from '@tanstack/react-query'
import ApiRating from '@/libs/api/api-rating'


export const useGetAllRatings = () => {
    return useQuery({
        queryKey: ['rating-all'],
        queryFn: () => ApiRating._get_all_ratings()
    })
}