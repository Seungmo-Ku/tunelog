'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { ResizableGridDefault } from '@/components/resizable-grid/resizeable-grid-default'
import { isEmpty } from 'lodash'


export const TopsterDefault = () => {
    const [gridSize, setGridSize] = useState(3) // 기본 그리드 사이즈 3x3
    const [items, setItems] = useState<string[]>(Array(100).fill(''))
    
    useEffect(() => {
        setItems((prev) => {
            const newItems = [...prev]
            newItems[3] = 'https://i.scdn.co/image/ab67616d0000b2736f578b21bce56056473da7e6'
            return newItems
        })
    }, [])
    
    const initialItems = useMemo(() => {
        return Array.from({ length: gridSize * gridSize }, (_, i) => ({
            id: (i + 1).toString(),
            content: (
                !isEmpty(items[i]) ? (
                    <img className='w-full h-full' alt={`image-${i + 1}`} src={items[i]}/>
                ) : (
                    <button className='w-full h-full flex items-center justify-center text-white cursor-pointer'>
                        Add item
                    </button>
                )
            
            )
        }))
    }, [gridSize, items])
    
    return (
        <div className='w-full flex flex-col overflow-hidden'>
            {/* 그리드 사이즈 조절 input 예시 (필요하면 주석 해제하여 사용) */}
            <div>
                <label htmlFor='gridSizeInput'>Grid Size: </label>
                <input
                    id='gridSizeInput'
                    type='range'
                    min='1'
                    max='10'
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                />
                <span>{gridSize}x{gridSize}</span>
            </div>
            <div
                className='w-full flex items-start justify-start overflow-y-auto hide-sidebar'
            >
                <ResizableGridDefault
                    initialItems={initialItems}
                    gridSize={gridSize}
                />
            </div>
        </div>
    )
}