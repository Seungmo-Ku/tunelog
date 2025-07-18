'use client'

import React, { useMemo } from 'react'
import { LogIn, LogOut } from 'lucide-react'
import { AccountStatus } from '@/libs/constants/account.constant'
import { useAccount } from '@/libs/utils/account'
import { useSetAtom } from 'jotai/index'
import { DialogLoginAtom } from '@/components/dialogs/dialog-login'
import { clsx } from 'clsx'
import { DialogLogoutAtom } from '@/components/dialogs/dialog-logout'


export interface NavbarAuthProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    onClick: () => void
    show: boolean
    title: string
}

export const useNavbarAuth = () => {
    const { status } = useAccount()
    
    const openDialogLogin = useSetAtom(DialogLoginAtom)
    const openDialogLogout = useSetAtom(DialogLogoutAtom)
    
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
            Icon: LogOut,
            show: status !== AccountStatus.guest,
            onClick: () => {
                openDialogLogout(prev => ({
                    ...prev,
                    open: true
                }))
            },
            title: 'Log Out'
        }
    ], [openDialogLogin, openDialogLogout, status])
    
    const navbarAuth = useMemo(() => {
        return (
            <div className='bg-tunelog-dark-alt rounded-[32px] flex flex-col py-[25px] px-[15px] gap-y-[31px] items-center justify-center'>
                {navbarAuthComponents.map((component, index) => {
                    if (!component.show) return null
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