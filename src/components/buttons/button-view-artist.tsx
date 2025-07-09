'use client'

import { Button } from '@/components/buttons/index'
import React, { useMemo } from 'react'
import { MicVocal } from 'lucide-react'
import { Artist } from '@/libs/interfaces/spotify.interface'
import { useRouter } from 'next/navigation'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


interface ButtonViewArtistProps {
    artists: Artist[] | null | undefined
}

export const ButtonViewArtist = ({
    artists
}: ButtonViewArtistProps) => {
    const appRouter = useRouter()
    const micIcon = useMemo(() => {
        return <MicVocal className='text-tunelog-secondary'/>
    }, [])
    
    if (!artists || artists.length === 0) {
        return <Button.Box text='View Artist' leftIcon={micIcon}/>
    }
    
    if (artists.length === 1) {
        return (
            <Button.Box
                text='View Artist'
                leftIcon={micIcon}
                onClick={() => appRouter.push(`/detail/artist/${artists[0].id}`)}
            />
        )
    }
    
    return (
        <Menu>
            <MenuButton>
                <Button.Box text='View Artist' leftIcon={micIcon}/>
            </MenuButton>
            <MenuItems transition anchor='bottom end' className='bg-tunelog-dark-alt border border-white/50 rounded-2xl p-4 flex flex-col gap-y-2 transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0'>
                <div className='w-full flex flex-col gap-y-1 items-start'>
                    {
                        artists.map((artist, index) => {
                            return (
                                <MenuItem key={`artist-menu-${artist.id}`}>
                                    <button
                                        className='text-white text-16-regular cursor-pointer rounded-xl'
                                        onClick={() => {
                                            appRouter.push(`/detail/artist/${artist.id}`)
                                        }}
                                    >
                                        {artist.name}
                                    </button>
                                </MenuItem>
                            )
                        })
                    }
                </div>
            </MenuItems>
        </Menu>
    )
}