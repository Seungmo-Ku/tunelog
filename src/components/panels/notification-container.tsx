'use client'

import { Notification } from '@/components/panels/notification'
import { useGetNotify } from '@/hooks/use-account'
import { useMemo } from 'react'
import { atom, useAtom } from 'jotai'


export const NotifyLengthAtom = atom(0)

export const NotificationContainer = () => {
    const { data: notify, isLoading: isAccountLoading } = useGetNotify()
    const [arrayLength, setArrayLength] = useAtom(NotifyLengthAtom)
    
    const notifyArray = useMemo(() => {
        if (isAccountLoading || notify === undefined || notify === null) {
            return []
        } else {
            setArrayLength(notify.length)
            return notify
        }
    }, [notify, isAccountLoading, setArrayLength])
    
    if (notifyArray === undefined || notifyArray === null || arrayLength === 0) {
        return (
            <div>
                There is no new notification
            </div>
        )
    } else return (
        <div className='w-80 min-h-10 max-h-45 overflow-y-scroll'>
            {
                notifyArray.map((notification, index) => {
                    return (
                        <Notification notification={notification} key={index}/>
                    )
                })
            }
        </div>
    )
}