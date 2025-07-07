'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { ResizableGridDefault } from '@/components/resizable-grid/resizeable-grid-default'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Dialogs } from '@/components/dialogs'
import { isEmpty } from 'lodash'
import { Input, Switch } from '@headlessui/react'
import { usePostTopster } from '@/hooks/use-topster'
import { Button } from '@/components/buttons'


export interface TopsterItem {
    id: string
    type: SearchType | null
    url: string
    title: string
}

export const TopsterDefault = () => {
    const [title, setTitle] = useState<string>('')
    const [author, setAuthor] = useState<string>('')
    const [showTitle, setShowTitle] = useState<boolean>(true)
    const [showType, setShowType] = useState<boolean>(true)
    const [gridSize, setGridSize] = useState(3)
    const [index, setIndex] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [items, setItems] = useState<TopsterItem[]>(Array(100).fill({
        id: '',
        type: null,
        url: '',
        title: ''
    }))
    
    const { mutateAsync, isPending } = usePostTopster()
    
    const initialItems = useMemo(() => {
        return Array.from({ length: gridSize * gridSize }, (_, i) => ({
            id: (i + 1).toString(),
            content: (
                <div
                    className='flex w-full h-full items-center justify-center'
                    onClick={() => {
                        setIndex(i)
                        setOpenDialog(true)
                    }}
                >
                    {
                        items[i].type !== null && !isEmpty(items[i].url) ? (
                            <img className='w-full h-full aspect-square' alt={`image-${i + 1}`} src={items[i].url}/>
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-white cursor-pointer'>
                                Add item
                            </div>
                        )
                    }
                </div>
            )
        }))
    }, [gridSize, items])
    
    const makeTopster = useCallback(async () => {
        if (isPending) return
        if (isEmpty(title) || isEmpty(author)) return
        try {
            const itemNumber = gridSize * gridSize
            const res = await mutateAsync({
                title,
                author,
                components: items.splice(0, itemNumber).map((item, index) => (
                    {
                        spotifyId: item.id,
                        type: item.type ?? SearchType.album,
                        width: 1,
                        height: 1,
                        x: index % gridSize,
                        y: Math.floor(index / gridSize),
                        imageUrl: item.url,
                        title: item.title
                    })),
                showTitles: showTitle,
                showTypes: showType,
                size: gridSize
            })
            if (res) {
                setTitle('')
                setAuthor('')
                setItems(Array(100).fill({
                    id: '',
                    type: null,
                    url: '',
                    title: ''
                }))
                setGridSize(3)
                setShowTitle(true)
                setShowType(true)
                setOpenDialog(false)
            }
        } catch (e) {
            console.error('Error creating topster:', e)
            return
        }
    }, [author, gridSize, isPending, items, mutateAsync, showTitle, showType, title])
    
    return (
        <div className='w-full flex md:flex-row flex-col gap-3 overflow-y-auto hide-sidebar'>
            <div className='w-full flex md:flex-row flex-col grow items-start justify-start gap-2'>
                <ResizableGridDefault
                    initialItems={initialItems}
                    gridSize={gridSize}
                />
                {
                    showTitle && (
                        <div className='flex flex-col gap-y-2 md:w-[200px] w-full'>
                            {
                                Array.from({ length: gridSize * gridSize }, (_, i) => {
                                    const isLastInRow = (i + 1) % gridSize === 0
                                    const isLastItem = i === (gridSize * gridSize) - 1
                                    return (
                                        <span
                                            key={`topster-item-title-${i}`}
                                            className={`text-white text-left text-14-regular whitespace-pre-wrap ${isLastInRow && !isLastItem ? 'mb-4' : ''}`}>
                                            {items[i].type ? `${items[i].title}${showType ? ` - ${items[i].type}` : ''}` : '(Empty Slot)'}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
            <div className='flex flex-col gap-y-3 md:w-[300px] w-full'>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor='titleInput' className='text-white'>Title</label>
                    <Input
                        id='titleInput'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter title'
                    />
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor='authorInput' className='text-white'>Author</label>
                    <Input
                        id='authorInput'
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder='Enter Author'
                    />
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor='gridSizeInput' className='text-white'>Size</label>
                    <div className='flex gap-x-2 w-full items-center'>
                        <input
                            id='gridSizeInput'
                            type='range'
                            min='1'
                            max='10'
                            value={gridSize}
                            onChange={(e) => setGridSize(Number(e.target.value))}
                            className='w-full'
                        />
                        <span>{gridSize}x{gridSize}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label htmlFor='showTitleSwitch' className='text-white'>Show item titles</label>
                    <Switch
                        id='showTitleSwitch'
                        checked={showTitle}
                        onChange={setShowTitle}
                        className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white'
                    >
                        <span
                            aria-hidden='true'
                            className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                        />
                    </Switch>
                </div>
                {
                    showTitle && (
                        <div className='flex flex-col gap-y-2'>
                            <label htmlFor='showTypeSwitch' className='text-white'>Show item types</label>
                            <Switch
                                id='showTypeSwitch'
                                checked={showType}
                                onChange={setShowType}
                                className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white'
                            >
                                <span
                                    aria-hidden='true'
                                    className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                                />
                            </Switch>
                        </div>
                    )
                }
                <Button.Box
                    text='Create Topster'
                    disabled={isEmpty(title) || isEmpty(author) || isPending}
                    onClick={makeTopster}
                    className='w-full'
                />
            </div>
            <Dialogs.TopsterItem
                open={openDialog}
                onCloseAction={() => setOpenDialog(false)}
                index={index}
                setItemsAction={setItems}
            />
        </div>
    )
}