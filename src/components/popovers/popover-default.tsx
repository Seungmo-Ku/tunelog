import { ArrowSvg } from '@/stories/assets/arrow'
import { Popover } from '@base-ui-components/react/popover'
import React from 'react'


export interface PopoverProps {
    trigger: React.ReactNode
    popup: React.ReactNode
    direction: 'top' | 'bottom' | 'left' | 'right'
}

export const PopoverDefault = ({ trigger, popup, direction }: PopoverProps) => {
    return (
        <Popover.Root>
            <Popover.Trigger>
                {trigger}
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side={direction} sideOffset={8}>
                    <Popover.Popup className='origin-[var(--transform-origin)] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300'>
                        <Popover.Arrow className='data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180'>
                            <ArrowSvg/>
                        </Popover.Arrow>
                        {popup}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}
