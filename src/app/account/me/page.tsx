'use client'

import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { Cards } from '@/components/cards'


const AccountMePage = () => {
    
    const { status, me } = useAccount()
    if (status === AccountStatus.guest) {
        return (
            <div className='text-white'>
                Please log in to view your account information.
            </div>
        )
    }
    return (
        <Cards.Account account={me} isMyAccount/>
    )
}

export default AccountMePage