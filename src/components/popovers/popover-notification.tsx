import { Notify } from '@/libs/interfaces/account.interface'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useCheckNotify } from '@/hooks/use-account'
import { Popover } from '@base-ui-components/react/popover'


interface NotificationProps {
    notification: Notify
    array: Notify[]
    setArray: (array: Notify[]) => void
}

export const PopoverNotification = ({
        notification, array, setArray
    }: NotificationProps
) => {
    
    const appRouter = useRouter()
    const { t } = useTranslation()
    const { mutateAsync: checkNotify } = useCheckNotify(notification._id)
    
    const handleUpdate = async () => {
        await checkNotify()
        setArray(array.filter(item => item._id !== notification._id))
    }
    
    return (
        <div className='flex'>
            <Popover.Close className='w-max-80 overflow-y-scroll mb-2 hover:cursor-pointer border-b-1'
                           onClick={() => {
                               if (notification.link !== undefined) {
                                   appRouter.push(notification.link)
                                   
                               }
                               handleUpdate()
                           }}>
                {t(notification.info, { name: notification.name, type: notification.type })}
            <X className='hover:cursor-pointer hover:bg-gray-200 text-red-500 size-6'
            </Popover.Close>
               onClick={() => {
                   handleUpdate()
               }}/>
        </div>
    )
}