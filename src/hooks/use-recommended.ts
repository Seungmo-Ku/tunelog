import { useQuery } from '@tanstack/react-query'
import ApiRecommended from '@/libs/api/api-recommended'


export const useGetRecommended = (limit: number = 10) => {
    return useQuery({
        queryKey: ['recommended', limit],
        queryFn: () => ApiRecommended._get_recommended(limit)
    })
}