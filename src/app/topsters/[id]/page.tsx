'use client'

import React, { useMemo, useRef, useState } from 'react'
import { useGetTopster } from '@/hooks/use-topster'
import { isEmpty } from 'lodash'
import { ResizableGridDefault } from '@/components/resizable-grid/resizeable-grid-default'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import { Button } from '@/components/buttons'
import { Pencil, Trash2 } from 'lucide-react'
import { Dialogs } from '@/components/dialogs'
import { useIsOwner } from '@/libs/utils/account'


const TopsterDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const appRouter = useRouter()
    const { data: topster, isLoading } = useGetTopster(id)
    const topsterRef = useRef<HTMLDivElement>(null)
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    
    const isOwner = useIsOwner(topster?.uid)
    
    const handleSaveAsImage = () => {
        const element = topsterRef.current
        if (!element) return
        
        // Find all images within the component
        const images = Array.from(element.getElementsByTagName('img'))
        const promises = images.map(img => {
            return new Promise<void>((resolve, reject) => {
                // If the image is already loaded (e.g., from cache)
                if (img.complete && img.naturalHeight !== 0) {
                    resolve()
                } else {
                    img.onload = () => resolve()
                    img.onerror = reject
                }
            })
        })
        
        // Wait for all images to load, then generate the canvas
        Promise.all(promises)
               .then(async () => {
                   if (!element) return
                   const canvas = await html2canvas(element, {
                       useCORS: true,
                       allowTaint: true, // Allow images from other domains to be rendered
                       backgroundColor: '#000', // Explicitly set a background color
                       logging: true // Enable logging for debugging
                   })
                   const link = document.createElement('a')
                   link.download = `${topster?.title ?? 'topster'}.png`
                   link.href = canvas.toDataURL('image/png')
                   link.click()
               })
               .catch(error => {
                   console.error('Error loading images for canvas:', error)
               })
    }
    
    const initialItems = useMemo(() => {
        if (!topster) return []
        return topster.components.map((component, index) => {
            return {
                id: (index + 1).toString(),
                content: (
                    <div
                        className='flex w-full h-full items-center justify-center'
                        onClick={() => {
                            if (isEmpty(component.imageUrl)) return
                            appRouter.push(`/detail/${component.type}/${component.spotifyId}`)
                        }}
                    >
                        {
                            !isEmpty(component.imageUrl) ? (
                                <img className='w-full h-full aspect-square' alt={`image-${index + 1}`} src={component.imageUrl}/>
                            ) : (
                                <div className='w-full h-full flex items-center justify-center bg-black'/>
                            )
                        }
                    </div>
                )
            }
        })
    }, [appRouter, topster])
    
    const gridSize = useMemo(() => topster ? topster.size : 0, [topster])
    
    const deleteComponent = useMemo(() => <Trash2 className='text-tunelog-secondary w-4 h-4 shrink-0'/>, [])
    const editComponent = useMemo(() => <Pencil className='text-tunelog-secondary w-4 h-4 shrink-0'/>, [])
    
    if (isLoading) {
        return <div className='text-white'>Loading...</div>
    }
    if (!topster) {
        return <div className='text-white'>Topster not found</div>
    }
    return (
        <div className='w-full h-full flex flex-col overflow-x-hidden overflow-y-auto hide-sidebar gap-y-10 text-white p-4'>
            <div className='flex md:flex-row flex-col md:justify-between items-start gap-2'>
                <div className='flex flex-col gap-y-2.5'>
                    <h1 className='text-36-bold text-[#A4C7C6]'>{topster?.title ?? ''}</h1>
                    <p className='text-14-regular text-[#EFEEE0]'>{`Made By ${topster?.author ?? ''}`}</p>
                    <p className='text-14-regular text-[#EFEEE0]'>{`Created At ${new Date(topster?.createdAt ?? 0).toLocaleDateString() ?? ''} | ${topster?.public ? 'Public' : 'Private'}`}</p>
                </div>
                {
                    isOwner && (
                        <div className='flex overflow-x-auto hide-sidebar gap-x-2'>
                            <Button.Box
                                text='Save as Image'
                                onClick={handleSaveAsImage}
                            />
                            <Button.Box
                                text='Delete'
                                onClick={() => setDeleteDialogOpen(true)}
                                leftIcon={deleteComponent}
                            />
                            <Button.Box
                                text='Edit'
                                onClick={() => {
                                    appRouter.push(`/topsters/edit/${id}`)
                                }}
                                leftIcon={editComponent}
                            />
                        </div>
                    )
                }
            </div>
            <div ref={topsterRef}>
                <div className='flex md:flex-row gap-x-8 gap-y-4 p-1'>
                    <ResizableGridDefault
                        initialItems={initialItems}
                        gridSize={gridSize}
                    />
                    {
                        topster?.showTitles && (
                            <div className='md:flex hidden flex-col gap-y-0.5 items-start justify-start md:w-[250px] w-full shrink-0'>
                                {
                                    topster?.components.map((component, index) => {
                                        return (
                                            <div
                                                key={`topster-item-title-${index}`}
                                                className='flex justify-start items-start gap-x-2 p-2 pl-0 rounded-md transition-colors cursor-pointer'
                                                onClick={() => {
                                                    if (isEmpty(component.spotifyId)) return
                                                    appRouter.push(`/detail/${component.type}/${component.spotifyId}`)
                                                }}
                                            >
                                                <span className='text-sm text-white'>{index + 1}.</span>
                                                <span className='text-white text-14-regular whitespace-pre-wrap'>
                                                    {component.type ? `${component.title}${topster?.showTypes ? ` - ${component.type}` : ''}` : '(Empty Slot)'}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <Dialogs.MutationObject
                open={deleteDialogOpen}
                onCloseAction={() => setDeleteDialogOpen(false)}
                object={topster}
                type='topster'
            />
        </div>
    )
}

export default TopsterDetailPage