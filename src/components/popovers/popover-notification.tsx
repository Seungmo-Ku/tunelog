import { Notify } from '@/libs/interfaces/account.interface'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useCheckNotify, useDeleteNotify } from '@/hooks/use-account'
import { Popover } from '@base-ui-components/react/popover'
import { clsx } from 'clsx'


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
    const { mutateAsync: deleteNotify } = useDeleteNotify(notification._id)
    
    const handleUpdate = async () => {
        await checkNotify()
        notification.checked = true //다시 렌더링되기 전까지 변경된 checked 상태 유지
    }
    
    const handleDelete = async () => {
        await deleteNotify()
        setArray(array.filter(item => item._id !== notification._id))
    }
    
    return (
        <div className={clsx('flex', { ['bg-amber-600']: !notification.checked })}>
            <Popover.Close className='w-max-80 active:scale-[0.95] transition-transform overflow-y-scroll box-border mb-1 hover:cursor-pointer border-b hover:border-white border-transparent'
                           onClick={() => {
                               if (notification.link !== undefined) appRouter.push(notification.link)
                               handleUpdate()
                           }}>
                {t(notification.info, { name: notification.name, type: notification.type })}
            </Popover.Close>
            <X className='hover:cursor-pointer text-red-500 size-6 active:scale-[0.95] transition-transform'
               onClick={() => {
                   handleDelete()
               }}/>
        </div>
    )
}