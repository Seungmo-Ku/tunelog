import React from 'react'
import { Button } from '@headlessui/react'
import { clsx } from 'clsx'


export interface ButtonBoxProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    text: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    disabled?: boolean
    className?: string
}

export const ButtonBox = ({
    text,
    leftIcon,
    rightIcon,
    disabled = false,
    className = '',
    ...props
}: ButtonBoxProps) => {
    return (
        <Button className={clsx('flex p-[10px] gap-x-[10px] items-center justify-center active:scale-[0.95] transition-transform rounded-[32px] bg-white/10 backdrop-blur-[5px] cursor-pointer text-12-regular', disabled ? 'transition-none active:scale-100 bg-black/20' : '', className)} {...props} disabled={disabled}>
            {leftIcon}
            <span className='text-white'>{text}</span>
            {rightIcon}
        </Button>
    )
}