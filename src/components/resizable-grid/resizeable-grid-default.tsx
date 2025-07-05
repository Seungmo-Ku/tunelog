import React, { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


interface ItemProps {
    id: string
    content: React.ReactNode
}

function SortableItem(props: ItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id })
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        cursor: 'grab'
    }
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='box-border'>
            {props.content}
        </div>
    )
}

interface ResizableGridDefaultProps {
    initialItems: ItemProps[]
    gridSize: number
}

export function ResizableGridDefault({ initialItems, gridSize }: ResizableGridDefaultProps) {
    const [items, setItems] = useState(initialItems)
    
    // initialItems prop이 변경될 때마다 내부 items 상태를 업데이트
    useEffect(() => {
        setItems(initialItems)
    }, [initialItems])
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over?.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }
    
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                        gap: '5px', // Adjust gap as needed
                        width: '100%', // Use full width of parent
                        aspectRatio: '1 / 1' // Ensure the grid container remains square
                    }}
                >
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id} content={item.content}/>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}
