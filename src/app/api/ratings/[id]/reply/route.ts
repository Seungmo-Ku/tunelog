import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Rating } from '@/models/rating-schema.model'


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
    if( !comment || typeof comment !== 'string' || comment.trim() === '' || comment.length > 500) {
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