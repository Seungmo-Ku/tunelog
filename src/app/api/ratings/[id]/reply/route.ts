import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Rating } from '@/models/rating-schema.model'
import { IReply } from '@/libs/interfaces/rating.interface'
import { isEmpty } from 'lodash'


export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const rating = await Rating.findById(id)
    if (!rating) {
        return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }
    const body = await req.json()
    const { comment, author } = body
    if (!comment || typeof comment !== 'string' || comment.trim() === '' || comment.length > 500) {
        return NextResponse.json({ error: 'Invalid comment' }, { status: 400 })
    }
    const newReply = {
        comment,
        author: author || '',
        uid: user._id.toString(),
        isEdited: false,
        deleted: false,
        likedUids: []
    }
    rating.replies.push(newReply)
    await rating.save()
    const object = rating.toObject()
    return NextResponse.json(object, { status: 201 }) // 201 Created
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    
    await connectDB()
    const rating = await Rating.findById(id)
    if (!rating) {
        return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }
    let replies = rating.replies as IReply[]
    replies = [...replies].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (cursor) {
        replies = replies.filter(reply => new Date(reply.createdAt) < new Date(cursor))
    }
    const pagedReplies = replies.slice(0, limit)
    const nextCursor = pagedReplies.length === limit ? pagedReplies[pagedReplies.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: pagedReplies,
        nextCursor
    })
}