'use client'

import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { NavbarComponentProps } from '@/components/navigation-bar/navitaion-bar-default'
import { usePathname, useRouter } from 'next/navigation'


export interface NavigationBarGroupProps {
    components: NavbarComponentProps[]
}

export const NavigationBarGroup = ({
    components
}: NavigationBarGroupProps) => {
    const pathname = usePathname()
    const appRouter = useRouter()
    
    const isPathInGroup = useMemo(() => components.some(component => pathname.startsWith(component.path)), [components, pathname])
    const selectedIndex = components.findIndex(component => pathname.startsWith(component.path))
    
    return (
        <div className='bg-tunelog-dark-alt rounded-[32px] flex flex-col py-[25px] px-[15px] gap-y-[31px] items-center justify-center'>
            {components.map((component, index) => {
                return (
                    <component.Icon
                        key={`icon-${index}`}
                        className={clsx('w-[22px] h-[22px] cursor-pointer shrink-0', (isPathInGroup && index === selectedIndex) ? 'text-tunelog-secondary' : 'text-[#EFEEE0] opacity-25')}
                        onClick={() => {
                            appRouter.push(component.path)
                        }}
                    />
                )
            })}
        </div>
    )
}