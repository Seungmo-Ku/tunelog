'use client'

import { PopoverNotification } from '@/components/popovers/popover-notification'
import { useGetNotify } from '@/hooks/use-account'
import { useMemo, useState } from 'react'
import { INotify } from '@/libs/interfaces/account.interface'


export const PopoverNotificationContainer = () => {
    const { data: notify, isLoading: isAccountLoading } = useGetNotify()
    const [array, setArray] = useState<INotify[]>([])
    
    useMemo(() => {
        if (isAccountLoading || notify === undefined || notify === null) {
        } else {
            setArray(notify)
        }
    }, [notify, isAccountLoading, setArray])
    
    if (array.length === 0 || isAccountLoading) {
        return (
            <div>
                {isAccountLoading ? <div>Loading notification...</div> : <div>There is no new notification</div>}
            </div>
        )
    } else return (
        <div className='w-75 min-h-8 max-h-33 overflow-y-scroll'>
            {
                array.map((notification, index) => {
                    return (
                        <PopoverNotification notification={notification} key={index} array={array} setArray={setArray}/>
                    )
                })
            }
        </div>
    )
}