import { clsx } from 'clsx'
import React from 'react'


export interface CardChartProps {
    imgUrl: string
    title: string
    subtitle: string
    additionalInfo?: string
    icon?: React.ReactNode
    containerClassName?: string
}

export const CardChart = ({
    imgUrl,
    title,
    subtitle,
    additionalInfo,
    icon,
    containerClassName = '',
    ...props
}: CardChartProps) => {
    return (
        <div {...props} className={clsx('bg-tunelog-dark-alt w-[417px] shrink-0 rounded-[20px] flex items-center justify-start p-[17px] pr-[21px] gap-x-[14px] transition active:scale-95 cursor-pointer', containerClassName)}>
            <img src={imgUrl} alt={imgUrl} className='w-[63px] h-[63px] rounded-[10px] shrink-0 aspect-square'/>
            <div className='flex flex-col gap-y-2 items-start grow flex-shrink min-w-0'>
                <div className='flex flex-col gap-y-1 items-start'>
                    <p className='text-17-regular text-white line-clamp-1'>{title}</p>
                    <p className='text-12-regular text-white/50 line-clamp-2'>{subtitle}</p>
                </div>
                <p className='text-12-regular text-white truncate'>{additionalInfo}</p>
            </div>
            {icon && (
                <div className='p-2 shrink-0 flex items-center justify-center rounded-full border border-white border-opacity-10'>
                    {icon}
                </div>
            )}
        </div>
    )
}