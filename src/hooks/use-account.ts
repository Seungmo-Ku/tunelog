import { useQuery } from '@tanstack/react-query'
import ApiAccount from '@/libs/api/api-account'


export const useGetMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => ApiAccount._get_me()
    })
}