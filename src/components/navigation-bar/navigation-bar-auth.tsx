'use client'

import React, { useMemo } from 'react'
import { Bell, LogIn, Settings, User } from 'lucide-react'
import { AccountStatus } from '@/libs/constants/account.constant'
import { useAccount } from '@/libs/utils/account'
import { useSetAtom } from 'jotai/index'
import { DialogLoginAtom } from '@/components/dialogs/dialog-login'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { DialogSettingsAtom } from '@/components/dialogs/dialog-settings'
import { Popover } from '@base-ui-components/react/popover'
import { PopoverNotificationContainer } from '@/components/popovers/popover-notification-container'
import { ArrowSvg } from '@/stories/assets/arrow'


export interface NavbarAuthProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    onClick: () => void
    show: boolean
    title: string
}

export const useNavbarAuth = () => {
    const { status } = useAccount()
    const appRouter = useRouter()
    const openDialogLogin = useSetAtom(DialogLoginAtom)
    const openDialogSettings = useSetAtom(DialogSettingsAtom)
    
    const navbarAuthComponents: NavbarAuthProps[] = useMemo(() => [
        {
            Icon: LogIn,
            show: status === AccountStatus.guest,
            onClick: () => {
                openDialogLogin(prev => ({
                    ...prev,
                    open: true
                }))
            },
            title: 'Log In'
        },
        {
            Icon: User,
            show: status !== AccountStatus.guest,
            onClick: () => {
                // openDialogLogout(prev => ({
                //     ...prev,
                //     open: true
                // }))
                appRouter.push('/account/me')
            },
            title: 'Account Info'
        },
        {
            Icon: Bell,
            show: status !== AccountStatus.guest,
            onClick: () => {
            },
            title: 'Notifications'
        },
        {
            Icon: Settings,
            show: true,
            onClick: () => {
                openDialogSettings(prev => ({
                    ...prev,
                    open: true
                }))
            },
            title: 'Settings'
        }
    ], [appRouter, openDialogLogin, openDialogSettings, status])
    
    const navbarAuth = useMemo(() => {
        return (
            <div className='bg-tunelog-dark-alt rounded-[32px] flex flex-col py-[25px] px-[15px] gap-y-[31px] items-center justify-center'>
                {navbarAuthComponents.map((component, index) => {
                    if (!component.show) return null
                    else if (component.title === 'Notifications') return (
                        <Popover.Root key={`icon-${index}`}>
                            <Popover.Trigger>
                                <component.Icon
                                    key={`icon-${index}`}
                                    className={clsx('w-[22px] h-[22px] cursor-pointer shrink-0 text-[#EFEEE0] opacity-25')}
                                />
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Positioner side={'right'} sideOffset={8}>
                                    <Popover.Popup className='origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300'>
                                        <Popover.Arrow className='data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180'>
                                            <ArrowSvg/>
                                        </Popover.Arrow>
                                        <PopoverNotificationContainer/>
                                    </Popover.Popup>
                                </Popover.Positioner>
                            </Popover.Portal>
                        </Popover.Root>
                    )
                    return (
                        <component.Icon
                            key={`icon-${index}`}
                            className={clsx('w-[22px] h-[22px] cursor-pointer shrink-0 text-[#EFEEE0] opacity-25')}
                            onClick={() => component.onClick()}
                        />
                    )
                })}
            </div>
        )
    }, [navbarAuthComponents])
    
    return {
        components: navbarAuthComponents,
        navbarAuth
    }
}