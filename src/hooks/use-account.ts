import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ApiAccount from '@/libs/api/api-account'
import { AccountLoginDto, AccountRegisterDto } from '@/libs/dto/account.dto'
import { QueryClient } from '@tanstack/query-core'


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