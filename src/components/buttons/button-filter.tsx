import React from 'react'
import { Button } from '@headlessui/react'
import { clsx } from 'clsx'


export interface ButtonFilterProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    text: string
    className?: string
    selected?: boolean
}

export const ButtonFilter = ({
    text,
    className = '',
    selected = false,
    ...props
}: ButtonFilterProps) => {
    return (
        <Button {...props} className={clsx('p-[10px] flex items-center justify-center text-14-regular rounded-[27px] min-w-[85px] cursor-pointer', className,
            selected ? 'bg-tunelog-secondary border-none text-tunelog-dark' : 'bg-none border border-tunelog-light text-tunelog-light')}>
            <span>{text}</span>
        </Button>
    )
}