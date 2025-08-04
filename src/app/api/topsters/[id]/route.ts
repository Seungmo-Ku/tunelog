import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing topster ID' }), { status: 400 })
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
    
    const topster = await Topster.findOne({ _id: id, deleted: false, ...userQuery }).select('-password')
    return NextResponse.json(topster, { status: 200 }) // 200 OK
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing topster ID' }), { status: 400 })
    }
    await connectDB()
    const user = await findUserByCookie()
    // noinspection DuplicatedCode
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const topster = await Topster.findById(id)
    if (!topster) {
        return new Response(JSON.stringify({ error: 'Topster not found' }), { status: 404 })
    }
    if (topster.uid.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    topster.deleted = true
    await topster.save()
    
    return NextResponse.json({ message: 'Topster deleted successfully' }, { status: 200 }) // 200 OK
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: 'Missing topster ID' }, { status: 400 })
    }
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const topster = await Topster.findById(id).select('+password')
    if (!topster) {
        return new Response(JSON.stringify({ error: 'Topster not found' }), { status: 404 })
    }
    if (topster.uid.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const body = await req.json()
    
    const { title, components, size, author, showTitles, showTypes, public: isPublic, onlyFollowers } = body
    
    if (title) {
        topster.title = title
    }
    
    if (components) {
        topster.components = components
    }
    
    if (size) {
        topster.size = size
    }
    
    if (author) {
        topster.author = author
    }
    
    if (showTitles !== undefined) {
        topster.showTitles = showTitles
    }
    
    if (showTypes !== undefined) {
        topster.showTypes = showTypes
    }
    if (isPublic !== undefined) {
        topster.public = isPublic
    }
    if (onlyFollowers !== undefined) {
        topster.onlyFollowers = onlyFollowers
    }
    
    topster.isEdited = true
    
    await topster.save()
    
    const updatedTopster = await Topster.findById(id).select('-password')
    
    return NextResponse.json(updatedTopster, { status: 200 })
}