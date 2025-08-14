import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Journal } from '@/models/journal-schema.model'
import { isEmpty } from 'lodash'
import { IReply } from '@/libs/interfaces/rating.interface'
import { Account } from '@/models/account-schema.model'


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
    journal.replies.push(newReply)
    await journal.save()
    const object = journal.toObject()
    if (object.uid !== user._id.toString()) {
        const createdReply = journal.replies[journal.replies.length - 1]
        const notify = {
            info: 'notify.new_comment',
            name: user.name, //보내는사람
            type: 'Journal',
            link: `/journals/${object._id}`,
            uid: object.uid, //받는사람
            _id: createdReply._id
        }
        await Account.updateOne({ _id: notify.uid }, { $push: { notify } })
    }
    return NextResponse.json(object, { status: 201 }) // 201 Created
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    
    await connectDB()
    const journal = await Journal.findById(id)
    if (!journal) {
        return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }
    let replies = (journal.replies as IReply[]).filter(reply => !reply.deleted)
    replies = [...replies].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (cursor) {
        replies = replies.filter(reply => new Date(reply.createdAt) < new Date(cursor))
    }
    const pagedReplies = replies.slice(0, limit)
    const nextCursor = (pagedReplies.length === limit && !isEmpty(pagedReplies)) ? pagedReplies[pagedReplies.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: pagedReplies,
        nextCursor
    })
}