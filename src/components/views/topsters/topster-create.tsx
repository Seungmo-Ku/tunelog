'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ResizableGridDefault } from '@/components/resizable-grid/resizeable-grid-default'
import { SearchType } from '@/libs/constants/spotify.constant'
import { Dialogs } from '@/components/dialogs'
import { isEmpty, noop } from 'lodash'
import { Input, Switch } from '@headlessui/react'
import { usePostTopster } from '@/hooks/use-topster'
import { Button } from '@/components/buttons'
import { useRouter } from 'next/navigation'
import { Topster } from '@/libs/interfaces/topster.interface'
import { useAccount } from '@/libs/utils/account'
import { useSetAtom } from 'jotai/index'
import { DialogLoginAtom } from '@/components/dialogs/dialog-login'
import { AccountStatus } from '@/libs/constants/account.constant'


export interface TopsterItem {
    id: string
    type: SearchType | null
    url: string
    title: string
}

export interface TopsterCreateProps {
    topster?: Topster | null | undefined
}

export const TopsterCreate = ({
    topster = null
}: TopsterCreateProps) => {
    const { me, status } = useAccount()
    const appRouter = useRouter()
    const [title, setTitle] = useState<string>('')
    const [showTitle, setShowTitle] = useState<boolean>(true)
    const [showType, setShowType] = useState<boolean>(true)
    const [gridSize, setGridSize] = useState(3)
    const [index, setIndex] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [items, setItems] = useState<TopsterItem[]>(Array(100).fill({
        id: '',
        type: null,
        url: '',
        title: ''
    }))
    const [isPublic, setIsPublic] = useState<boolean>(false)
    const setLoginDialogOpen = useSetAtom(DialogLoginAtom)
    
    useEffect(() => {
        if (!topster) return
        setTitle(topster.title)
        setShowTitle(topster.showTitles ?? true)
        setShowType(topster.showTypes ?? true)
        setGridSize(topster.size)
        setIsPublic(topster.public ?? false)
        setItems(() => {
            const newItems = Array(100).fill({
                id: '',
                type: null,
                url: '',
                title: ''
            })
            topster.components.forEach((component, index) => {
                if (index < newItems.length) {
                    newItems[index] = {
                        id: component.spotifyId,
                        type: component.type,
                        url: component.imageUrl,
                        title: component.title
                    }
                }
            })
            return newItems
        })
    }, [topster])
    
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
        if (isPending || isEmpty(title)) return
        if (status === AccountStatus.guest) {
            setLoginDialogOpen((prev) => (
                { ...prev, open: true }
            ))
            return
        }
        try {
            const itemNumber = gridSize * gridSize
            const res = await mutateAsync({
                title,
                author: me?.name ?? '',
                components: items.slice(0, itemNumber).map((item, index) => (
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
                size: gridSize,
                public: isPublic
            })
            if (res) {
                setTitle('')
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
                setIsPublic(false)
                appRouter.push('/topsters')
            }
        } catch (e) {
            console.error('Error creating topster:', e)
            return
        }
    }, [appRouter, gridSize, isPending, isPublic, items, me?.name, mutateAsync, setLoginDialogOpen, showTitle, showType, status, title])
    
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
                <div className='flex flex-col gap-y-2'>
                    <p className='text-white'>{isPublic ? 'Set the topster visible to everyone' : 'Set the topster personal'}</p>
                    <Switch
                        checked={isPublic}
                        onChange={setIsPublic}
                        className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white shrink-0'
                    >
                        <span
                            aria-hidden='true'
                            className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7'
                        />
                    </Switch>
                </div>
                <Button.Box
                    text={`${topster ? 'Update' : 'Create'} Topster`}
                    disabled={isEmpty(title) || isPending}
                    onClick={() => {
                        if (!topster) {
                            makeTopster().then(noop) // 탑스터 생성
                        } else {
                            setOpenEditDialog(true)
                        }
                    }}
                    className='w-full'
                />
            </div>
            <Dialogs.TopsterItem
                open={openDialog}
                onCloseAction={() => setOpenDialog(false)}
                index={index}
                setItemsAction={setItems}
            />
            <Dialogs.MutationObject
                open={openEditDialog}
                onCloseAction={() => setOpenEditDialog(false)}
                object={topster}
                type='topster'
                action='update'
                updateObject={{
                    title,
                    showTitles: showTitle,
                    showTypes: showType,
                    size: gridSize,
                    components: items.slice(0, gridSize * gridSize).map((item, idx) => ({
                        spotifyId: item.id,
                        type: item.type ?? SearchType.album,
                        width: 1,
                        height: 1,
                        x: idx % gridSize,
                        y: Math.floor(idx / gridSize),
                        imageUrl: item.url,
                        title: item.title
                    })),
                    public: isPublic
                }}
            />
        </div>
    )
}