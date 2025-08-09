'use client'

import { useGetJournal } from '@/hooks/use-journal'
import React, { useMemo, useState } from 'react'
import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Cards } from '@/components/cards'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/buttons'
import { Dialogs } from '@/components/dialogs'
import { Pencil, Trash2 } from 'lucide-react'
import { useIsOwner } from '@/libs/utils/account'
import { useTranslation } from 'react-i18next'
import { useLikes } from '@/libs/utils/likes'
import { useComment } from '@/libs/utils/comment'


const JournalDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const appRouter = useRouter()
    const { t } = useTranslation()
    const { id } = React.use(params)
    const { data: journal, isLoading: isJournalLoading } = useGetJournal(id)
    
    const { data: albums, isLoading: isAlbumLoading } = useGetAlbumsQuery(journal?.subjects.filter((subject) => subject.type === 'album').map(subject => subject.spotifyId) || [])
    const { data: artists, isLoading: isArtistLoading } = useGetArtistsQuery(journal?.subjects.filter((subject) => subject.type === 'artist').map(subject => subject.spotifyId) || [])
    const { data: tracks, isLoading: isTrackLoading } = useGetTracksQuery(journal?.subjects.filter((subject) => subject.type === 'track').map(subject => subject.spotifyId) || [])
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    
    const { likesButton } = useLikes({ object: journal, type: 'journal' })
    const { commentButton } = useComment({ type: 'journal', id })
    
    // noinspection DuplicatedCode
    const subjectMap = useMemo(() => {
        const map: Record<string, Album | Artist | Track> = {}
        
        albums?.forEach(album => map[album.id] = album)
        artists?.forEach(artist => map[artist.id] = artist)
        tracks?.forEach(track => map[track.id] = track)
        
        return map
    }, [albums, artists, tracks])
    
    const tagList = useMemo(() => {
        const tags: string[] = Object.values(journal?.tags ?? {})
        return tags.filter(tag => !isEmpty(tag)).map(tag => `#${tag}`).join(', ')
    }, [journal?.tags])
    
    const isLoading = useMemo(() => isJournalLoading || isAlbumLoading || isArtistLoading || isTrackLoading, [isJournalLoading, isAlbumLoading, isArtistLoading, isTrackLoading])
    
    const deleteComponent = useMemo(() => <Trash2 className='text-tunelog-secondary w-4 h-4 shrink-0'/>, [])
    const editComponent = useMemo(() => <Pencil className='text-tunelog-secondary w-4 h-4 shrink-0'/>, [])
    
    const isOwner = useIsOwner(journal?.uid)
    
    if (isLoading) {
        return <div className='text-white'>Loading...</div>
    }
    
    if (!journal) {
        return <div className='text-white'>Journal not found</div>
    }
    
    return (
        <div className='w-full h-full flex flex-col gap-y-5 overflow-y-auto hide-sidebar text-white p-1'>
            <div className='w-full flex flex-col gap-y-3'>
                <h1 className='text-24-semibold'>{journal?.title}</h1>
                <div onClick={() => appRouter.push(`/account/${journal?.uid}`)}>
                    <p className='text-14-regular underline'>{`By ${journal?.author ?? ''}`}</p>
                </div>
                <p className='text-14-regular'>{`${t('keywords.created')} ${new Date(journal?.createdAt ?? '').toLocaleDateString()} | ${journal?.public ? t('keywords.public') : t('keywords.private')} ${(journal.public && journal.onlyFollowers && isOwner) ? '(Only To Followers)' : ''}`}</p>
                {(journal?.updatedAt ?? 0) > (journal?.createdAt ?? 0) && <p className='text-14-regular'>{`${t('keywords.last_edited')} At ${new Date(journal?.updatedAt ?? '').toLocaleDateString()}`}</p>}
                <div className='flex flex-row gap-x-1'>
                    {likesButton}
                    {commentButton}
                </div>
            </div>
            <div className='flex gap-x-3 overflow-x-auto hide-sidebar shrink-0 items-start'>
                {
                    journal?.subjects.map((subject, index) => {
                        const subjectData = subjectMap[subject.spotifyId]
                        if (!subjectData) return null
                        const imgUrl = subject.type === 'track' ? (subjectData as Track)?.album?.images[0].url : (subjectData as Artist | Album).images[0].url
                        return (
                            <button
                                key={`${journal._id}-${index}`}
                                onClick={() => {
                                    appRouter.push(`/detail/${subject.type}/${subject.spotifyId}`)
                                }}
                            >
                                <Cards.Default imgUrl={imgUrl ?? '/favicon.ico'} title={subjectData.name} subtitle={subject.type}/>
                            </button>
                        )
                    })
                }
            </div>
            <div className='text-16-regular' dangerouslySetInnerHTML={{ __html: journal?.content ?? '' }}/>
            <div className='text-14-regular text-white/50'>
                {tagList}
            </div>
            {isOwner &&
                (
                    <div className='flex w-full gap-x-2'>
                        <Button.Box
                            text={t('keywords.delete')}
                            onClick={() => setDeleteDialogOpen(true)}
                            leftIcon={deleteComponent}
                        />
                        <Button.Box
                            text={t('keywords.edit')}
                            onClick={() => {
                                appRouter.push(`/journals/edit/${journal?._id}`)
                            }}
                            leftIcon={editComponent}
                        />
                    </div>
                )
            }
            <Dialogs.MutationObject
                open={deleteDialogOpen}
                onCloseAction={() => setDeleteDialogOpen(false)}
                object={journal}
                type='journal'
            />
        </div>
    )
}

export default JournalDetailPage