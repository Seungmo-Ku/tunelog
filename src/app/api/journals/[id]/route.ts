import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing journal ID' }), { status: 400 })
    }
    await connectDB()
    
    const user = await findUserByCookie()
    
    const userQuery = user ?
        {
            $or: [
                { public: true, onlyFollowers: false },
                { public: true, onlyFollowers: true, uid: { $in: user.followingUids } },
                { uid: user._id.toString() }
            ]
        } :
        {
            public: true, onlyFollowers: false
        }
    
    const journal = await Journal.findOne({ _id: id, deleted: false, ...userQuery }).select('-password')
    if (!journal) {
        return new Response(JSON.stringify({ error: 'Journal not found' }), { status: 404 })
    }
    return NextResponse.json(journal, { status: 200 }) // 200 OK
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing journal ID' }), { status: 400 })
    }
    await connectDB()
    const user = await findUserByCookie()
    // noinspection DuplicatedCode
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const journal = await Journal.findById(id)
    if (!journal) {
        return new Response(JSON.stringify({ error: 'Journal not found' }), { status: 404 })
    }
    if (journal.uid.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    journal.deleted = true
    await journal.save()
    
    return NextResponse.json({ message: 'Journal deleted successfully' }, { status: 200 }) // 200 OK
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: 'Missing journal ID' }, { status: 400 })
    }
    // noinspection DuplicatedCode
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const journal = await Journal.findById(id)
    if (!journal) {
        return new Response(JSON.stringify({ error: 'Journal not found' }), { status: 404 })
    }
    if (journal.uid.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const body = await req.json()
    
    const { title, content, tags, author, subjects, public: isPublic } = body
    
    if (title) {
        journal.title = title
    }
    if (content) {
        journal.content = content
    }
    if (tags) {
        journal.tags = tags
    }
    if (author) {
        journal.author = author
    }
    if (subjects) {
        journal.subjects = subjects
    }
    if (isPublic !== undefined) {
        journal.public = isPublic
    }
    
    await journal.save()
    
    const updateJournal = await Journal.findById(id).select('-password')
    
    return NextResponse.json(updateJournal, { status: 200 })
}