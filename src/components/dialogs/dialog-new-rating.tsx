'use client'
import { Dialog, DialogPanel, DialogTitle, Input, Textarea } from '@headlessui/react'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { useMemo, useState } from 'react'
import { SearchType } from '@/libs/constants/spotify.constant'
import { useGetAlbumQuery, useGetArtistQuery, useGetTrackQuery } from '@/hooks/use-spotify'
import { usePostRating } from '@/hooks/use-rating'
import { Button } from '@/components/buttons'
import { isEmpty } from 'lodash'
import { RatingCreateRequest } from '@/libs/dto/rating.dto'


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
    const [score, setScore] = useState<number>(5)
    
    const { mutateAsync, isPending } = usePostRating()
    
    const { data: albumData, isLoading: albumLoading } = useGetAlbumQuery(selectedType === SearchType.album ? selectedObjectId : '')
    const { data: artistData, isLoading: artistLoading } = useGetArtistQuery(selectedType === SearchType.artist ? selectedObjectId : '')
    const { data: trackData, isLoading: trackLoading } = useGetTrackQuery(selectedType === SearchType.track ? selectedObjectId : '')
    
    const isLoading = useMemo(() => albumLoading || artistLoading || trackLoading, [albumLoading, artistLoading, trackLoading])
    
    const dialogTitle = useMemo(() => {
        if (isLoading || !selectedType || !selectedObjectId) return 'New Rating'
        switch (selectedType) {
            case SearchType.album:
                return `New Rating for Album: ${albumData?.name || 'Loading...'}`
            case SearchType.artist:
                return `New Rating for Artist: ${artistData?.name || 'Loading...'}`
            case SearchType.track:
                return `New Rating for Track: ${trackData?.name || 'Loading...'}`
            default:
                return 'New Rating'
        }
    }, [albumData?.name, artistData?.name, isLoading, selectedObjectId, selectedType, trackData?.name])
    
    return (
        <Dialog transition open={open} onClose={onCloseAction} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl'>
                    <DialogTitle className='font-bold'>{dialogTitle}</DialogTitle>
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
                    <Input
                        placeholder='Score (0-5)'
                        type='number'
                        value={score}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (isNaN(value)) setScore(0)
                            else if (value >= 0 && value <= 5) setScore(value)
                            else if (value < 0) setScore(0)
                            else if (value > 5) setScore(5)
                        }}
                    />
                    <Input
                        className='w-full py-1 border-white border'
                        placeholder='Author'
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        maxLength={10}
                    />
                    <Textarea
                        className='w-full py-1 border-white border'
                        placeholder='Comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
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