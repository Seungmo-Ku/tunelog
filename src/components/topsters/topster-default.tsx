'use client'

import React, { useState } from 'react'
import { Input } from '@headlessui/react'


export const TopsterDefault = () => {
    const [size, setSize] = useState({ lg: 5, md: 5, sm: 5, xs: 5, xxs: 5 })
    
    return (
        <div className='w-full flex flex-col overflow-hidden'>
            <Input
                value={size.lg}
                onChange={(e) => {
                    const value = parseInt(e.target.value, 10)
                    if (!isNaN(value)) {
                        setSize({ lg: value, md: value, sm: value, xs: value, xxs: value })
                    }
                }}
            />
            <div
                className='w-full flex items-start justify-start overflow-y-auto hide-sidebar max-h-[500px]'
                // style={{ height: size.lg * 100 + 'px' }}
            >
                {/*<ReactGridLayout
                 layouts={layout}
                 cols={size}
                 rowHeight={100}
                 maxRows={size.lg}
                 className=''
                 compactType={null}
                 preventCollision
                 style={{ width: size.lg * 100 + 'px' }}
                 >
                 {layout.lg.map(item => (
                 <div key={item.i} className="bg-gray-300 border border-gray-400 rounded-lg flex items-center justify-center">
                 <span>{item.i}</span>
                 </div>
                 ))}
                 </ReactGridLayout>*/}
            </div>
        
        </div>
    )
}