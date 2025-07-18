'use client'

import { useRouter } from 'next/navigation'
import { AlignJustify } from 'lucide-react'
import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { navbarMainComponents } from '@/components/navigation-bar/navitaion-bar-default'
import { useNavbarAuth } from '@/components/navigation-bar/navigation-bar-auth'


export const NavigationBarMobile = () => {
    const appRouter = useRouter()
    const { components } = useNavbarAuth()
    return (
        <div className='w-full h-[50px] bg-tunelog-dark-alt flex items-center justify-between p-1'>
            <span className='text-24-semibold text-white cursor-pointer' onClick={() => appRouter.push('/dashboard')}>TUNELOG</span>
            <Menu>
                <MenuButton>
                    <AlignJustify className='text-white size-5 shrink-0 mr-1 cursor-pointer'/>
                </MenuButton>
                <MenuItems transition anchor='bottom end' className='bg-tunelog-dark-alt border border-white/50 rounded-2xl p-4 flex flex-col gap-y-2 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0'>
                    <div className='w-full flex flex-col gap-y-1 items-start'>
                        {
                            navbarMainComponents.map((component, index) => {
                                return (
                                    <MenuItem key={`mobile-navbar-${index}`}>
                                        <button
                                            className='text-white text-16-regular cursor-pointer rounded-xl'
                                            onClick={() => {
                                                appRouter.push(component.path)
                                            }}
                                        >
                                            {component.path.split('/').pop()}
                                        </button>
                                    </MenuItem>
                                )
                            })
                        }
                    </div>
                    {/*<div className='h-[1px] w-full bg-white'/>*/}
                    {/*<div className='w-full flex flex-col gap-y-1 items-start'>
                     {
                     navbarDetailComponents.map((component, index) => {
                     return (
                     <MenuItem key={`mobile-navbar-${index}`}>
                     <button
                     className='text-white text-16-regular cursor-pointer rounded-xl'
                     onClick={() => {
                     appRouter.push(component.path)
                     }}
                     >
                     {component.path.split('/').pop()}
                     </button>
                     </MenuItem>
                     )
                     })
                     }
                     </div>*/}
                    <div className='h-[1px] w-full bg-white'/>
                    <div className='w-full flex flex-col gap-y-1 items-start'>
                        {
                            components.map((component, index) => {
                                if (!component.show) return null
                                return (
                                    <MenuItem key={`mobile-navbar-${index}`}>
                                        <button
                                            className='text-white text-16-regular cursor-pointer rounded-xl'
                                            onClick={() => {
                                                component.onClick()
                                            }}
                                        >
                                            {component.title}
                                        </button>
                                    </MenuItem>
                                )
                            })
                        }
                    </div>
                </MenuItems>
            </Menu>
        
        </div>
    )
}