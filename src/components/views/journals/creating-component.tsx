'use client'

import Tiptap, { TiptapRef } from '@/components/Tiptap'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '@headlessui/react'
import { Button } from '@/components/buttons'
import { TopSearchBar } from '@/components/views/dashboard/top-search-bar'
import { isEmpty } from 'lodash'
import { useGetAlbumsQuery, useGetArtistsQuery, useGetTracksQuery } from '@/hooks/use-spotify'
import { Album, Artist, Track } from '@/libs/interfaces/spotify.interface'
import { Cards } from '@/components/cards'
import { usePostJournal } from '@/hooks/use-journal'
import { useRouter } from 'next/navigation'
import { Tags } from '@/libs/interfaces/journal.interface'


interface SelectedObjectProps {
    id: string
    type: 'album' | 'artist' | 'track'
}

export const CreatingComponent = () => {
    const editRef = useRef<TiptapRef>(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [tags, setTags] = useState<Tags>({
        weather: '',
        mood: '',
        scene: '',
        custom: ''
    })
    const [password, setPassword] = useState('')
    const [selectedObjectId, setSelectedObjectId] = useState<string>('')
    const [selectedObject, setSelectedObject] = useState<SelectedObjectProps[]>([])
    
    const appRouter = useRouter()
    
    const { mutateAsync, isPending } = usePostJournal()
    
    const handleClick = useCallback(async () => {
        if (isEmpty(title) || isPending || isEmpty(selectedObject) || isEmpty(author)) return
        const html = editRef.current?.getHTML()
        if (isEmpty(html)) return
        const subjects = selectedObject.map(obj => {
            return {
                type: obj.type,
                spotifyId: obj.id
            }
        })
        const res = await mutateAsync({
            subjects,
            title,
            content: html ?? '',
            author,
            tags,
            password
        })
        if (res) {
            appRouter.replace(`/journals`)
        }
    }, [appRouter, author, isPending, mutateAsync, password, selectedObject, tags, title])
    
    useEffect(() => {
        if (selectedObject.length > 0) {
            const lastObject = selectedObject[selectedObject.length - 1]
            if (isEmpty(lastObject.id)) {
                setSelectedObject(prev => {
                    const newObject = { ...lastObject, id: selectedObjectId }
                    return [...prev.slice(0, -1), newObject]
                })
                setSelectedObjectId('')
            }
        } else {
            setSelectedObjectId('')
        }
    }, [selectedObject, selectedObjectId])
    
    const albumsOfSelected = selectedObject.filter(obj => obj.type === 'album')
    const artistsOfSelected = selectedObject.filter(obj => obj.type === 'artist')
    const tracksOfSelected = selectedObject.filter(obj => obj.type === 'track')
    
    const { data: albums, isLoading: isAlbumLoading } = useGetAlbumsQuery(albumsOfSelected.map(obj => obj.id).filter(id => !isEmpty(id)))
    const { data: artists, isLoading: isArtistLoading } = useGetArtistsQuery(artistsOfSelected.map(obj => obj.id).filter(id => !isEmpty(id)))
    const { data: tracks, isLoading: isTrackLoading } = useGetTracksQuery(tracksOfSelected.map(obj => obj.id).filter(id => !isEmpty(id)))
    
    const albumsById = useMemo(() => {
        if (!albums) return {}
        return albums.reduce((acc, album) => {
            acc[album.id] = album
            return acc
        }, {} as Record<string, Album>)
    }, [albums])
    
    const artistsById = useMemo(() => {
        if (!artists) return {}
        return artists.reduce((acc, artist) => {
            acc[artist.id] = artist
            return acc
        }, {} as Record<string, Artist>)
    }, [artists])
    
    const tracksById = useMemo(() => {
        if (!tracks) return {}
        return tracks.reduce((acc, track) => {
            acc[track.id] = track
            return acc
        }, {} as Record<string, Track>)
    }, [tracks])
    
    const isLoading = useMemo(() => isAlbumLoading || isArtistLoading || isTrackLoading, [isAlbumLoading, isArtistLoading, isTrackLoading])
    
    const objectsShowingComponent = useMemo(() => {
        if (isLoading) return null
        else return (
            <div className='flex flex-row overflow-x-auto w-full gap-x-5 shrink-0'>
                {
                    selectedObject.map((obj, index) => {
                        switch (obj.type) {
                            case 'album':
                                const album = albumsById[obj.id]
                                if (!album) return null
                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedObject(prev => prev.filter(o => o.id !== obj.id || o.type !== obj.type))
                                        }}
                                        key={index}>
                                        <Cards.Default imgUrl={album.images[0].url} title={`${album.name} - ${obj.type}`} subtitle={''}/>
                                    </div>
                                )
                            case 'artist':
                                const artist = artistsById[obj.id]
                                if (!artist) return null
                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedObject(prev => prev.filter(o => o.id !== obj.id || o.type !== obj.type))
                                        }}
                                        key={index}>
                                        <Cards.Default imgUrl={artist.images[0].url} title={`${artist.name} - ${obj.type}`} subtitle={''}/>
                                    </div>
                                )
                            case 'track':
                                const track = tracksById[obj.id]
                                if (!track) return null
                                return (
                                    <div
                                        onClick={() => {
                                            setSelectedObject(prev => prev.filter(o => o.id !== obj.id || o.type !== obj.type))
                                        }}
                                        key={index}>
                                        <Cards.Default imgUrl={track.album?.images[0].url ?? '/favicon.ico'} title={`${track.name} - ${obj.type}`} subtitle={''}/>
                                    </div>
                                )
                            default:
                                return null
                        }
                    })
                }
            </div>
        )
        
    }, [albumsById, artistsById, isLoading, selectedObject, tracksById])
    
    return (
        <div className='text-white w-full h-full flex flex-col gap-y-3 p-3 '>
            <div className='flex gap-x-3'>
                <Input
                    className='w-full py-1 border-white border'
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={50}
                />
                <Button.Box text='Upload' onClick={handleClick}/>
            </div>
            <Input
                className='w-full py-1 border-white border'
                placeholder='Author'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                maxLength={10}
            />
            <TopSearchBar
                onAlbumClick={() => {
                    setSelectedObject(prev => [...prev, { id: '', type: 'album' }])
                }}
                onArtistClick={() => {
                    setSelectedObject(prev => [...prev, { id: '', type: 'artist' }])
                }}
                onTrackClick={() => {
                    setSelectedObject(prev => [...prev, { id: '', type: 'track' }])
                }}
                setSelectedObjectId={setSelectedObjectId}
                className={''}
            />
            {objectsShowingComponent}
            <div className='w-full h-[500px]'>
                <Tiptap ref={editRef}/>
            </div>
            <div className='w-full flex flex-col gap-y-5'>
                <span className='text-18-regular'>Tags (Optional)</span>
                <div className='w-full grid md:grid-cols-2 grid-cols-1 gap-3 pb-5'>
                    <Input
                        className='w-full py-1'
                        placeholder='Weather? (e.g. Sunny, Rainy)'
                        value={tags.weather}
                        onChange={(e) => {
                            setTags(prev => ({ ...prev, weather: e.target.value }))
                        }}
                        maxLength={10}
                    />
                    <Input
                        className='w-full py-1'
                        placeholder='Mood? (e.g. Happy, Sad)'
                        value={tags.mood}
                        onChange={(e) => {
                            setTags(prev => ({ ...prev, mood: e.target.value }))
                        }}
                        maxLength={10}
                    />
                    <Input
                        className='w-full py-1'
                        placeholder='Scene? (e.g. Beach, Mountain)'
                        value={tags.scene}
                        onChange={(e) => {
                            setTags(prev => ({ ...prev, scene: e.target.value }))
                        }}
                        maxLength={10}
                    />
                    <Input
                        className='w-full py-1'
                        placeholder='Anything else? (e.g. Custom Tag)'
                        value={tags.custom}
                        onChange={(e) => {
                            setTags(prev => ({ ...prev, custom: e.target.value }))
                        }}
                        maxLength={10}
                    />
                </div>
                <Input
                    className='w-full py-1 border-white border'
                    placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
    )
}