import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Rating } from '@/models/rating-schema.model'
import { IReply } from '@/libs/interfaces/rating.interface'
import { Account } from '@/models/account-schema.model'
import mongoose from 'mongoose'


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string, replyId: string }> }) => {
    const { id, replyId } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!id || !replyId) {
        return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
    }
    const rating = await Rating.findById(id)
    if (!rating) {
        return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }
    if (!rating.replies.some((reply: IReply) => reply._id.toString() === replyId && reply.uid.toString() === user._id.toString())) {
        return NextResponse.json({ error: 'Reply not found or not owned by user' }, { status: 404 })
    }
    rating.replies = rating.replies.filter((reply: IReply) => reply._id.toString() !== replyId)
    await rating.save()
    const objectReplyId = new mongoose.Types.ObjectId(replyId)
    await Account.updateOne({ _id: rating.uid }, { $pull: { notify: { _id: objectReplyId } } })
    return NextResponse.json('OK', { status: 200 })
}