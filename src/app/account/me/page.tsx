'use client'

import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { Cards } from '@/components/cards'
import { useGetMyObjectCount } from '@/hooks/use-account'


const AccountMePage = () => {
    const { status, me } = useAccount()
    const { data } = useGetMyObjectCount()
    if (status === AccountStatus.guest) {
        return (
            <div className='text-white'>
                Please log in to view your account information.
            </div>
        )
    }
    return (
        <div className='overflow-y-auto hide-sidebar h-full'>
            <Cards.Account account={me} objectCount={data} isMyAccount/>
        </div>
    )
}

export default AccountMePage