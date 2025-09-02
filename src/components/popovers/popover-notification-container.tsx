'use client'

import { PopoverNotification } from '@/components/popovers/popover-notification'
import { useGetNotify } from '@/hooks/use-account'
import { useEffect, useMemo } from 'react'
import { atom, useAtom } from 'jotai'


export const NotifyLengthAtom = atom(0)

export const PopoverNotificationContainer = () => {
    const { data: notify, isLoading: isAccountLoading } = useGetNotify()
    const [arrayLength, setArrayLength] = useAtom(NotifyLengthAtom)
    
    const notifyArray = useMemo(() => {
        if (isAccountLoading || notify === undefined || notify === null) {
            return []
        } else {
            return notify
        }
    }, [notify, isAccountLoading])
    
    useEffect(() => {
        setArrayLength(notifyArray.length)
    }, [setArrayLength, notifyArray])
    
    if (arrayLength === 0) {
        return (
            <div>
                {isAccountLoading ? <div>Loading notification...</div> : <div>There is no new notification</div>}
            </div>
        )
    } else return (
        <div className='w-80 min-h-10 max-h-35 overflow-y-scroll'>
            {
                notifyArray.map((notification, index) => {
                    return (
                        <PopoverNotification notification={notification} key={index}/>
                    )
                })
            }
        </div>
    )
}