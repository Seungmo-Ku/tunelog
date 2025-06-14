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
        <div {...props} className={clsx('w-full h-[72px] flex bg-opacity-25 items-center justify-start pl-[27px] gap-x-5', className)}>
            <Search className='text-white/25 w-4 h-4'/>
            <Input
                type='text'
                className='grow text-white outline-0'
                placeholder='Search'
                value={value ?? ''}
                onChange={(e) => {
                    setValue?.(e.target.value)
                }}
            />
        </div>
    )
}