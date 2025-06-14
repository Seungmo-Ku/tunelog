import { SearchType } from '@/libs/constants/spotify.constant'
import { clsx } from 'clsx'


export interface SearchBarResultProps {
    imgUrl: string
    title: string
    type: SearchType
    subtitle?: string
    className?: string
}

export const SearchBarResult = ({
    imgUrl,
    title,
    type,
    subtitle = '',
    className = '',
    ...props
}: SearchBarResultProps) => {
    
    if(type === SearchType.artist) subtitle = 'Artist'
    
    return (
        <div {...props} className={clsx('w-full flex p-3 items-center gap-x-3 bg-tunelog-dark-alt/80 rounded-2xl', className)}>
            <img src={imgUrl} alt={imgUrl} className={clsx('w-[60px] h-[60px] shrink-0 aspect-square', type === SearchType.artist ? 'rounded-full' : 'rounded-lg')} />
            <div className='flex flex-col grow'>
                <span className='text-white text-16-regular'>{title}</span>
                {subtitle && <span className='text-12-regular text-white/50'>{subtitle}</span>}
            </div>
        </div>
    )
}