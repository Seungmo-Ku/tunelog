'use client'

import { Dialog, DialogPanel, DialogTitle, Input, Textarea } from '@headlessui/react'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { useEffect, useMemo, useState } from 'react'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { usePostRating } from '@/hooks/use-rating'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { RatingCreateRequest } from '@/libs/dto/rating.dto'
import { Rating } from 'react-simple-star-rating'


interface DialogNewRatingProps {
    open: boolean
    onCloseAction: () => void
}

export const DialogNewRating = ({
    open,
    onCloseAction
}: DialogNewRatingProps) => {
    const [selectedObjectId, setSelectedObjectId] = useState<string>('')
    const [selectedType, setSelectedType] = useState<SearchType | null>(null)
    const [comment, setComment] = useState<string>('')
    const [author, setAuthor] = useState<string>('')
    const [score, setScore] = useState<number>(0)
    
    const { mutateAsync, isPending } = usePostRating()
    
    const { data: albumData, isLoading: albumLoading } = useGetAlbumQuery(selectedType === SearchType.album ? selectedObjectId : '')
    const { data: artistData, isLoading: artistLoading } = useGetArtistQuery(selectedType === SearchType.artist ? selectedObjectId : '')
    const { data: trackData, isLoading: trackLoading } = useGetTrackQuery(selectedType === SearchType.track ? selectedObjectId : '')
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            
            const hash = window.location.hash.substring(1)
            if (hash) {
                const params = new URLSearchParams(hash)
                const objectId = params.get('initialSelectedObjectId') ?? undefined
                const objectType = params.get('initialSelectedType') as SearchType | null
                
                if (objectId) setSelectedObjectId(objectId)
                if (objectType) setSelectedType(objectType)
            }
        }
    }, [])
    
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
                    <DialogTitle className='font-bold'>New Rating</DialogTitle>
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
                    <Rating
                        onClick={setScore}
                        ratingValue={score}
                        size={30}
                    />
                    <Input
                        className='w-full py-1 border-white border'
                        placeholder='Author'
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        maxLength={10}
                    />
                    <Textarea
                        className='w-full py-1 border-white border min-h-[100px]'
                        placeholder='Comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                    />
                    <Button.Box
                        text='create new rating!'
                        disabled={isPending || isEmpty(selectedObjectId) || isEmpty(comment) || isEmpty(author)}
                        onClick={async () => {
                            if (isPending || !selectedType || isEmpty(selectedObjectId) || isEmpty(comment) || isEmpty(author)) return
                            const ratingData: RatingCreateRequest = {
                                spotifyId: selectedObjectId,
                                type: selectedType,
                                author,
                                score,
                                comment
                            }
                            await mutateAsync(ratingData)
                            onCloseAction()
                            setScore(5)
                            setComment('')
                            setAuthor('')
                            setSelectedObjectId('')
                            setSelectedType(null)
                        }}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}