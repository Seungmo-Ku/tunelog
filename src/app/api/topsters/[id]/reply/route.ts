import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Topster } from '@/models/topster-schema.model'


export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const topster = await Topster.findById(id)
    if (!topster) {
        return NextResponse.json({ error: 'Topster not found' }, { status: 404 })
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
    topster.replies.push(newReply)
    await topster.save()
    const object = topster.toObject()
    return NextResponse.json(object, { status: 201 }) // 201 Created
}