import { Notify } from '@/libs/interfaces/account.interface'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useAtom } from 'jotai/index'
import { NotifyLengthAtom } from '@/components/popovers/popover-notification-container'
import { useCheckNotify } from '@/hooks/use-account'


interface NotificationProps {
    notification: Notify
}

export const PopoverNotification = ({
        notification
    }: NotificationProps
) => {
    
    const [popover, setPopover] = useState(true) //새로고침 전에 화면에서 사라지게함
    const [arrayLength, setArrayLength] = useAtom(NotifyLengthAtom) //새로고침 전에 화면에 no new notification 띄움
    const appRouter = useRouter()
    const { t } = useTranslation()
    const { mutateAsync: checkNotify } = useCheckNotify(notification._id)
    
    const handleUpdate = async () => {
        await checkNotify()
        setPopover(false)
        setArrayLength(arrayLength - 1)
    }
    
    if (popover) {
        return (
            <div className='flex'>
                <div className='w-max-80 overflow-y-scroll mb-2 hover: cursor-pointer hover:bg-gray-100 border-b-1'
                     onClick={() => {
                         if (notification.link !== undefined) appRouter.push(notification.link)
                         handleUpdate()
                     }}>
                    {t(notification.info, { name: notification.name, type: notification.type })}
                </div>
                <X className='hover: cursor-pointer hover:bg-gray-200 text-red-500 size-6'
                   onClick={() => {
                       handleUpdate()
                   }}/>
            </div>
        )
    } else return null
}