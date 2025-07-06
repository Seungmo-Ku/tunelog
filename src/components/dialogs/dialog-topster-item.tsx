'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import React, { useMemo, useState } from 'react'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { TopsterItem } from '@/components/topsters/topster-default'


interface DialogTopsterItemProps {
    open: boolean
    onCloseAction: () => void
    index: number
    setItemsAction: React.Dispatch<React.SetStateAction<TopsterItem[]>>
}

export const DialogTopsterItem = ({
    open,
    onCloseAction,
    index,
    setItemsAction
}: DialogTopsterItemProps) => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>('')
    const [selectedType, setSelectedType] = useState<SearchType | null>(null)
    
    const { data: albumData, isLoading: albumLoading } = useGetAlbumQuery(selectedType === SearchType.album ? selectedObjectId : '')
    const { data: artistData, isLoading: artistLoading } = useGetArtistQuery(selectedType === SearchType.artist ? selectedObjectId : '')
    const { data: trackData, isLoading: trackLoading } = useGetTrackQuery(selectedType === SearchType.track ? selectedObjectId : '')
    
    const isLoading = useMemo(() => albumLoading || artistLoading || trackLoading, [albumLoading, artistLoading, trackLoading])
    
    const objectImage = useMemo(() => {
        if (!selectedType || !selectedObjectId) return null
        if (isLoading) return (
            <div className='flex items-center gap-x-3'>
                <div className='size-[100px] shrink-0 aspect-square animate-pulse rounded-2xl'/>
                <p className='text-14-regular'>Loading...</p>
            </div>
        )
        const imgUrl = selectedType === SearchType.track ? trackData?.album?.images[0].url : (selectedType === SearchType.artist ? artistData?.images[0].url : albumData?.images[0].url)
        const title = selectedType === SearchType.track ? trackData?.name : (selectedType === SearchType.artist ? artistData?.name : albumData?.name)
        if (!imgUrl || !title) return null
        return (
            <div className='flex items-center gap-x-3'>
                <img src={imgUrl} alt='object_image' className='size-[100px] shrink-0 aspect-square rounded-2xl'/>
                <p className='text-14-regular'>{title}</p>
            </div>
        )
    }, [albumData?.images, albumData?.name, artistData?.images, artistData?.name, isLoading, selectedObjectId, selectedType, trackData?.album?.images, trackData?.name])
    
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Add Items</DialogTitle>
                    {objectImage}
                    <TopSearchBar
                        onAlbumClick={() => {
                            setSelectedType(SearchType.album)
                        }}
                        onArtistClick={() => {
                            setSelectedType(SearchType.artist)
                        }}
                        onTrackClick={() => {
                            setSelectedType(SearchType.track)
                        }}
                        setSelectedObjectId={setSelectedObjectId}
                        className={''}
                    />
                    <Button.Box
                        text='Add Item'
                        disabled={isEmpty(selectedObjectId)}
                        onClick={() => {
                            setItemsAction((prev) => {
                                const newItems = [...prev]
                                newItems[index] = {
                                    id: selectedObjectId,
                                    type: selectedType,
                                    url: selectedType === SearchType.track ? (trackData?.album?.images[0].url ?? '') : (selectedType === SearchType.artist ? (artistData?.images[0].url ?? '') : (albumData?.images[0].url ?? '')),
                                    title: selectedType === SearchType.track ? trackData?.name ?? '' : (selectedType === SearchType.artist ? artistData?.name ?? '' : albumData?.name ?? '')
                                }
                                return newItems
                            })
                            onCloseAction()
                            setSelectedObjectId('')
                            setSelectedType(null)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}