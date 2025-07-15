'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { forwardRef, useImperativeHandle } from 'react'


export type TiptapRef = {
    getHTML: () => string
}

type TiptapProps = {
    initialContent?: string
}

const Tiptap = forwardRef<TiptapRef, TiptapProps>(({ initialContent }, ref) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent || '<p></p>'
    })
    
    useImperativeHandle(ref, () => ({
        getHTML: () => editor?.getHTML() || ''
    }), [editor])
    
    if (!editor) return null
    
    return (
        <div className='w-full h-full'>
            <EditorContent editor={editor} className='w-full h-full overflow-y-scroll border border-white'/>
        </div>
    
    )
})

Tiptap.displayName = 'Tiptap'

export default Tiptap
