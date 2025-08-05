import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { IReply } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/models/journal-schema.model'


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string, replyId: string }> }) => {
    const { id, replyId } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user || !id || !replyId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const journal = await Journal.findById(id)
    if (!journal) {
        return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }
    if (!journal.replies.some((reply: IReply) => reply._id.toString() === replyId && reply.uid.toString() === user._id.toString())) {
        return NextResponse.json({ error: 'Reply not found or not owned by user' }, { status: 404 })
    }
    journal.replies = journal.replies.filter((reply: IReply) => reply._id.toString() !== replyId)
    await journal.save()
    return NextResponse.json('OK', { status: 200 })
}