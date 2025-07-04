import { Input } from '@headlessui/react'
import { Search } from 'lucide-react'
import React from 'react'
import { clsx } from 'clsx'


export interface SearchBarDefaultProps extends React.HtmlHTMLAttributes<HTMLInputElement> {
    className?: string
    value?: string
    setValue?: React.Dispatch<React.SetStateAction<string>>
}

export const SearchBarDefault = ({
    className,
    value,
    setValue,
    ...props
}: SearchBarDefaultProps) => {
    return (
        <div {...props} className={clsx('w-full h-[72px] flex bg-opacity-25 items-center justify-start md:pl-[27px] pl-3 gap-x-5 text-14-regular', className)}>
            <Search className='text-white/25 w-4 h-4 md:flex hidden'/>
            <Input
                type='text'
                className='grow text-white outline-0'
                placeholder='Search for albums, artists, tracks...'
                value={value ?? ''}
                onChange={(e) => {
                    setValue?.(e.target.value)
                }}
            />
        </div>
    )
}