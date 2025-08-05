import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Journal } from '@/models/journal-schema.model'


export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const journal = await Journal.findById(id)
    if (!journal) {
        return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }
    const body = await req.json()
    const { comment, author } = body
    const newReply = {
        comment,
        author: author || '',
        uid: user._id.toString(),
        isEdited: false,
        deleted: false,
        likedUids: []
    }
    journal.replies.push(newReply)
    await journal.save()
    const object = journal.toObject()
    delete object.password
    return NextResponse.json(object, { status: 201 }) // 201 Created
}