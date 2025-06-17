'use client'

import { Cards } from '@/components/cards'
import { useCallback, useMemo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useGetAllJournals } from '@/hooks/use-journal'
import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Tags } from '@/libs/interfaces/journal.interface'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'


export const TopJournal = () => {
    
    const appRouter = useRouter()
    const { data: journals, isLoading: journalsLoading } = useGetAllJournals(4)
    
    const idsOfSubjects = useMemo(() => {
        if (!journals) return {
            album: [],
            artist: [],
            track: []
        }
        
        return journals.reduce((acc, journal) => {
            const subject = journal.subjects?.[0]
            if (!subject) return acc
            
            acc[subject.type].push(subject.spotifyId)
            return acc
        }, {
            album: [],
            artist: [],
            track: []
        } as Record<'album' | 'artist' | 'track', string[]>)
    }, [journals])
    const { data: albums, isLoading: albumsLoading } = useGetAlbumsQuery(idsOfSubjects.album)
    const { data: artists, isLoading: artistsLoading } = useGetArtistsQuery(idsOfSubjects.artist)
    const { data: tracks, isLoading: tracksLoading } = useGetTracksQuery(idsOfSubjects.track)
    
    const subjectMap = useMemo(() => {
        const map: Record<string, Album | Artist | Track> = {}
        
        albums?.forEach(album => map[album.id] = album)
        artists?.forEach(artist => map[artist.id] = artist)
        tracks?.forEach(track => map[track.id] = track)
        
        return map
    }, [albums, artists, tracks])
    const tagsToString = useCallback((tags: Tags | undefined) => {
        if (isEmpty(tags)) return ''
        const tagValues: string[] = Object.values(tags).filter(tag => !isEmpty(tag)).map(tag => `#${tag}`)
        return tagValues.join(' ')
    }, [])
    
    const ArrowUpRightIcon = useMemo(() => {
        return <ArrowUpRight className='text-white'/>
    }, [])
    
    const isLoading = useMemo(() => journalsLoading || albumsLoading || artistsLoading || tracksLoading,
        [journalsLoading, albumsLoading, artistsLoading, tracksLoading])
    
    return (
        <div className='w-full max-h-full flex flex-col gap-y-3 overflow-y-scroll'>
            {
                isLoading ?
                Array.from({ length: 4 }).map((_, index) => (
                    <Cards.ChartSkeleton key={`TopJournal-Skeleton-${index}`}/>
                )) :
                journals?.map((journal, index) => {
                    const subject = journal.subjects[0]
                    const subjectData = subjectMap[subject.spotifyId]
                    const imgUrl = subject.type === SearchType.track ? (subjectData as Track)?.album.images[0].url : (subjectData as Artist | Album).images[0].url
                    return (
                        <div onClick={() => appRouter.push(`/journals/${journal._id}`)} className='cursor-pointer' key={`TopJournal-${index}`}>
                            <Cards.Chart
                                key={index}
                                imgUrl={imgUrl}
                                title={journal.title}
                                subtitle={new Date(journal.createdAt).toLocaleDateString()}
                                additionalInfo={tagsToString(journal.tags)}
                                icon={ArrowUpRightIcon}
                                containerClassName='w-full'
                            />
                        </div>
                    )
                })
            }
            {!journalsLoading && <div className='flex flex-col gap-y-[5px] w-full p-[17px] pr-[21px] shrink-0 justify-center rounded-[20px] bg-white/5 hover:bg-white/10 transition cursor-pointer items-center active:scale-95'>
                <p className='text-white text-14-bold text-center'>View more Journal</p>
            </div>}
        </div>
    )
}