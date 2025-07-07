import React from 'react'
import { clsx } from 'clsx'
import { Topster } from '@/libs/interfaces/topster.interface'


export interface CardTopsterProps {
    topster: Topster
    containerClassName?: string
    showTransitionOnClick?: boolean
}

export const CardTopster = ({
    topster,
    containerClassName = '',
    showTransitionOnClick = false
}: CardTopsterProps) => {
    const { title, size, author, createdAt, updatedAt, components } = topster
    
    const getPreviewImages = () => {
        const imageComponents = components.slice(0, 4)
        if (imageComponents.length === 0) {
            return <div className='w-full h-full bg-gray-700 rounded-[8px]'/>
        }
        if (imageComponents.length === 1) {
            return <img src={imageComponents[0].imageUrl} className='w-full h-full object-cover rounded-[8px]'/>
        }
        return (
            <div className='grid grid-cols-2 grid-rows-2 w-full h-full gap-1'>
                {imageComponents.map((component, index) => (
                    <img key={index} src={component.imageUrl} className='w-full h-full object-cover first:rounded-tl-[8px] second:rounded-tr-[8px] third:rounded-bl-[8px] fourth:rounded-br-[8px]'/>
                ))}
            </div>
        )
    }
    
    return (
        <div className={clsx('grid w-full shrink-0 grid-cols-[1fr_2fr_1fr_1fr_2fr] backdrop-blur-[5px] bg-[#33373B] rounded-[15px] p-[10px] items-center cursor-pointer transition', showTransitionOnClick ? 'active:scale-[0.98]' : '', containerClassName)}>
            <div className='w-20 h-20 shrink-0'>
                {getPreviewImages()}
            </div>
            <div className='text-12-regular text-white text-left line-clamp-2'>{title}</div>
            <div className='text-12-regular text-white text-left'>{size}x{size}</div>
            <div className='text-12-regular text-white text-left'>{author}</div>
            <div className='text-12-bold text-tunelog-secondary text-left'>
                <div>{new Date(createdAt).toLocaleDateString()}</div>
                {updatedAt && createdAt !== updatedAt && <div>(Updated At)</div>}
            </div>
        </div>
    )
}
