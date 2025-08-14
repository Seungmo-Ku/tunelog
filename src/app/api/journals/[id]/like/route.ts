import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Journal } from '@/models/journal-schema.model'
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
    if (journal.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'Already liked' }, { status: 400 }) // 400 Bad Request
    }
    journal.likedUids.push(user._id.toString())
    await journal.save()
    if (journal.uid !== user._id.toString()) { //본인 글의 like가 아닌경우
        const notify = {
            info: 'notify.new_like',
            name: user.name, //보내는사람
            type: 'Journal',
            link: `/journals/${id}`,
            uid: user._id.toString()
        }
        await Account.updateOne({ _id: journal.uid }, { $push: { notify } })
    }
    return NextResponse.json('OK', { status: 200 })
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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
    if (!journal.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'No likes by user' }, { status: 400 }) // 400 Bad Request
    }
    journal.likedUids = journal.likedUids.filter((uid: string) => uid !== user._id.toString())
    await journal.save()
    await Account.updateOne({ _id: journal.uid }, { $pull: { notify: { uid: user._id.toString(), link: `/journals/${id}` } } })
    return NextResponse.json('OK', { status: 200 })
}