import React from 'react'
import { clsx } from 'clsx'


export interface NavigationBarGroupProps {
    icons: React.ComponentType<React.SVGProps<SVGSVGElement>>[],
    selectedIndex?: number
}

export const NavigationBarGroup = ({
    icons,
    selectedIndex
}: NavigationBarGroupProps) => {
    return (
        <div className='bg-[#1A1E1F] rounded-[32px] flex flex-col py-[25px] px-[15px] gap-y-[31px] items-center justify-center'>
            {icons.map((Icon, index) => {
                return <Icon key={`icon-${index}`}  className={clsx('w-[22px] h-[22px] cursor-pointer shrink-0', index === selectedIndex ? 'text-[#FACD66]' : 'text-[#EFEEE0] opacity-25')}/>
            })}
        </div>
    )
}