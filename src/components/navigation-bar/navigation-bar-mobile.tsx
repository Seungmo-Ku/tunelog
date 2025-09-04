'use client'

import { useRouter } from 'next/navigation'
import { AlignJustify, Bell } from 'lucide-react'
import React, { useState } from 'react'
import { Dialogs } from '@/components/dialogs'
import { PopoverContainer } from '@/components/popovers/popover-container'


export const NavigationBarMobile = () => {
    const appRouter = useRouter()
    const [open, setOpen] = useState(false)
    return (
        <div className='w-full h-[50px] bg-tunelog-dark-alt flex items-center justify-between p-1'>
            <span className='text-24-semibold text-white cursor-pointer' onClick={() => appRouter.push('/dashboard')}>TUNELOG</span>
            <div className='flex items-center space-x-2'>
                <PopoverContainer direction={'bottom'} trigger={<Bell className='text-white size-5 shrink-0 mr-1 cursor-pointer'/>}/>
                <AlignJustify className='text-white size-5 shrink-0 mr-1 cursor-pointer' onClick={() => setOpen(!open)}/>
            </div>
            <Dialogs.MobileRightDrawer open={open} onCloseAction={() => setOpen(false)}/>
        </div>
    )
}