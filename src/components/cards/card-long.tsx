import React from 'react'
import { clsx } from 'clsx'


export interface CardLongProps {
    imgUrl: string
    leftIcon?: React.ReactNode
    title?: string
    type?: string
    duration?: string
    rightIcon?: React.ReactNode
    containerClassName?: string
}

export const CardLong = ({
    imgUrl,
    leftIcon,
    title = '',
    type = '',
    duration = '',
    rightIcon,
    containerClassName = ''
}: CardLongProps) => {
    return (
        <div className={clsx('grid w-[1125px] shrink-0 grid-cols-[2fr_4fr_4fr_4fr_1fr] backdrop-blur-[5px] bg-[#33373B] rounded-[15px] p-[10px] items-center', containerClassName)}>
            <div className='flex gap-x-[18px] items-center'>
                <img src={imgUrl} className='rounded-[8px] w-10 h-10 shrink-0'/>
                {leftIcon && <div className='shrink-0'>{leftIcon}</div>}
            </div>
            <div className='text-12-regular text-white'>{title}</div>
            <div className='text-12-regular text-white'>{type}</div>
            <div className='text-12-regular text-white'>{duration}</div>
            {!!rightIcon ? rightIcon : <div/>}
        </div>
    )
}
