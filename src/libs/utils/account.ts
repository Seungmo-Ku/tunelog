import { useGetMe } from '@/hooks/use-account'
import { AccountStatus } from '@/libs/constants/account.constant'


export const useAccount = () => {
    const { data } = useGetMe()
    const status = data?._id ? AccountStatus.user : AccountStatus.guest
    const me = data || null
    return {
        status,
        me
    }
}

export const useIsOwner = (uid?: string) => {
    const { status, me } = useAccount()
    if (!uid) return false
    return status === AccountStatus.admin || (status === AccountStatus.user && me?._id === uid)
}