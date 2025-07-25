'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import React, { Fragment } from 'react'
import { navbarMainComponents } from '@/components/navigation-bar/navitaion-bar-default'
import { useRouter } from 'next/navigation'
import { useNavbarAuth } from '@/components/navigation-bar/navigation-bar-auth'


interface DialogMobileRightDrawerProps {
    open: boolean
    onCloseAction: () => void
}

export const DialogMobileRightDrawer = ({
    open,
    onCloseAction
}: DialogMobileRightDrawerProps) => {
    const appRouter = useRouter()
    const { components } = useNavbarAuth()
    
    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onCloseAction} className='relative z-50'>
                <div className='fixed inset-0 flex w-screen items-center p-4 bg-black/50'>
                    <TransitionChild
                        as={Fragment}
                        enter='transition-transform duration-300'
                        enterFrom='translate-x-full'
                        enterTo='translate-x-0'
                        leave='transition-transform duration-200'
                        leaveFrom='translate-x-0'
                        leaveTo='translate-x-full'
                    >
                        <DialogPanel className='fixed right-0 top-0 w-1/2 h-full bg-tunelog-dark-alt p-4 flex flex-col gap-y-5'>
                            <DialogTitle className='text-white text-30-semibold'>Menu</DialogTitle>
                            <div className='w-full flex flex-col gap-y-1 items-start'>
                                {
                                    navbarMainComponents.map((component, index) => {
                                        return (
                                            <div key={`mobile-navbar-${index}`} className='w-full'>
                                                <button
                                                    className='text-white text-20-regular cursor-pointer rounded-xl flex items-center gap-x-2 w-full p-1 active:scale-95 transition duration-300'
                                                    onClick={() => {
                                                        appRouter.push(component.path)
                                                        onCloseAction()
                                                    }}
                                                >
                                                    <component.Icon className='w-[30px] h-[30px] cursor-pointer shrink-0 text-[#EFEEE0]'/>
                                                    {component.path.split('/').pop()}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='h-[1px] w-full bg-white'/>
                            <div className='w-full flex flex-col gap-y-1 items-start'>
                                {
                                    components.map((component, index) => {
                                        if (!component.show) return null
                                        return (
                                            <div key={`mobile-navbar-${index}`}>
                                                <button
                                                    className='text-white text-20-regular cursor-pointer rounded-xl'
                                                    onClick={() => {
                                                        component.onClick()
                                                        onCloseAction()
                                                    }}
                                                >
                                                    {component.title}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}