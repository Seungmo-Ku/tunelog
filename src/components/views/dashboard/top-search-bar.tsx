'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SearchBar } from '@/components/search-bar'
import { debounce, isEmpty } from 'lodash'
import { useSearchAllQuery } from '@/hooks/use-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { SearchType } from '@/libs/constants/spotify.constant'
import { clsx } from 'clsx'


export interface TopSearchBarProps {
    onAlbumClick?: () => void
    onArtistClick?: () => void
    onTrackClick?: () => void
    setSelectedObjectId?: React.Dispatch<React.SetStateAction<string>>
    className?: string
}

export const TopSearchBar = ({
    onAlbumClick,
    onArtistClick,
    onTrackClick,
    setSelectedObjectId,
    className = ''
}: TopSearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')
    const [openSearchResult, setOpenSearchResult] = useState<boolean>(true)
    
    const wrapperRef = useRef<HTMLDivElement>(null) // 외부 클릭 감지 ref
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current) {
                if (wrapperRef.current.contains(event.target as Node)) setOpenSearchResult(true)
                else setOpenSearchResult(false)
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    
    const debouncedFetch = useMemo(() => debounce((query: string) => {
        setDebouncedSearchQuery(query)
    }, 300), [])
    
    useEffect(() => {
        debouncedFetch(searchQuery)
        return () => {
            debouncedFetch.cancel()
        }
    }, [searchQuery, debouncedFetch])
    
    const { data, isLoading } = useSearchAllQuery(debouncedSearchQuery, 2)
    const albums = useMemo(() => data?.albums.items.map(album => new Album(album)) || [], [data])
    const artists = useMemo(() => data?.artists.items.map(artist => new Artist(artist)) || [], [data])
    const tracks = useMemo(() => data?.tracks.items.map(track => new Track(track)) || [], [data])
    
    return (
        <div ref={wrapperRef} className='w-full flex flex-col relative' onChange={() => setOpenSearchResult(true)}>
            <SearchBar.Default
                value={searchQuery}
                setValue={setSearchQuery}
                className={`${className} ${openSearchResult ? 'border border-white' : 'border-none'}`}
                onFocus={() => setOpenSearchResult(true)}
            />
            <div className={clsx('flex flex-col w-full bg-tunelog-dark-alt absolute top-[72px] z-10 transition-all duration-300 ease-in-out overflow-y-scroll max-h-[450px]',
                (openSearchResult && !isEmpty(debouncedSearchQuery) ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none')
            )}>
                <div className='text-white p-3 bg-tune-dark-alt/80'>Album Results:</div>
                {
                    isLoading ? <SearchBar.ResultSkeleton/> : isEmpty(albums) ? null : albums.map((album, index) => {
                        return (
                            <SearchBar.Result
                                imgUrl={album.images[0]?.url ?? ''}
                                title={album.name}
                                subtitle={album.artists.map(artist => artist.name).join(', ')}
                                type={SearchType.album}
                                key={`TopSearchBar-Album-${index}`}
                                onClick={onAlbumClick ? () => {
                                    setSelectedObjectId?.(album.id)
                                    onAlbumClick()
                                    setOpenSearchResult(false)
                                } : undefined}
                            />
                        )
                    })
                }
                <div className='text-white p-3 bg-tune-dark-alt/80'>Artist Results:</div>
                {
                    isLoading ? <SearchBar.ResultSkeleton/> : isEmpty(artists) ? null : artists.map((artist, index) => {
                        return (
                            <SearchBar.Result
                                imgUrl={artist.images[0]?.url ?? ''}
                                title={artist.name}
                                type={SearchType.artist}
                                key={`TopSearchBar-Artist-${index}`}
                                onClick={onArtistClick ? () => {
                                    setSelectedObjectId?.(artist.id)
                                    onArtistClick()
                                    setOpenSearchResult(false)
                                } : undefined}
                            />
                        )
                    })
                }
                <div className='text-white p-3 bg-tune-dark-alt/80'>Track Results:</div>
                {
                    isLoading ? <SearchBar.ResultSkeleton/> : isEmpty(tracks) ? null : tracks.map((track, index) => {
                        return (
                            <SearchBar.Result
                                imgUrl={track.album.images[0]?.url ?? ''}
                                title={track.name}
                                subtitle={track.artists.map(artist => artist.name).join(', ')}
                                type={SearchType.track}
                                key={`TopSearchBar-Track-${index}`}
                                onClick={onTrackClick ? () => {
                                    setSelectedObjectId?.(track.id)
                                    onTrackClick()
                                    setOpenSearchResult(false)
                                } : undefined}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}