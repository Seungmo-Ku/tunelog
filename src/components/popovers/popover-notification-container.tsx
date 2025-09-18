'use client'

import { PopoverNotification } from '@/components/popovers/popover-notification'
import { useGetNotify } from '@/hooks/use-account'
import { useEffect, useMemo, useState } from 'react'
import { INotify } from '@/libs/interfaces/account.interface'
import { useInView } from 'react-intersection-observer'


export const PopoverNotificationContainer = () => {
    const { data: notify, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isAccountLoading } = useGetNotify(4)
    const [array, setArray] = useState<INotify[]>([])
    const { ref, inView } = useInView()
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])
    
    useMemo(() => {
        if (isAccountLoading || notify === undefined || notify === null) {
        } else {
            setArray(notify.pages.flatMap(page => page.data))
        }
    }, [notify, isAccountLoading, setArray])
    
    if (array.length === 0 || isAccountLoading) {
        return (
            <div>
                {isAccountLoading ? <div>Loading notification...</div> : <div>There is no new notification</div>}
            </div>
        )
    } else return (
        <div className='w-75 min-h-8 max-h-25 overflow-y-scroll'>
            {
                array.map((notification, index) => {
                    return (
                        <PopoverNotification notification={notification} key={index} array={array} setArray={setArray}/>
                    )
                })
            }
            <div ref={ref}/>
        </div>
    )
}