'use client'

import { Notification } from '@/components/panels/notification'


export const NotificationContainer = () => {
    return (
        <div className='w-60 min-h-15 max-h-45 overflow-y-scroll border-black border-2'>
            <Notification>
            </Notification>
        </div>
    )
    
}