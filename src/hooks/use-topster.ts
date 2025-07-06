import { useMutation } from '@tanstack/react-query'
import { TopsterCreateRequest } from '@/libs/dto/topster.dto'
import ApiTopster from '@/libs/api/api-topster'


export const usePostTopster = () => {
    // const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (topster: TopsterCreateRequest) => await ApiTopster._post_topster(topster),
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['topster-all'] })
        }
    })
}