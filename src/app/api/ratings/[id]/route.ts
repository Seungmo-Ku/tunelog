import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing rating ID' }), { status: 400 })
    }
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    const rating = await Rating.findById(id)
    if (!rating) {
        return new Response(JSON.stringify({ error: 'Rating not found' }), { status: 404 })
    }
    if (rating.uid.toString() !== user._id.toString()) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    
    rating.deleted = true
    await rating.save()
    
    return NextResponse.json({ message: 'Rating deleted successfully' }, { status: 200 })
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: 'Missing rating ID' }, { status: 400 })
    }
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const rating = await Rating.findById(id)
    if (!rating) {
        return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }
    
    if (rating.uid.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    
    const { public: isPublic, onlyFollowers } = body
    if (isPublic !== undefined) {
        if (rating.public !== isPublic) {
            rating.public = isPublic
            rating.isEdited = true
        }
    }
    if (onlyFollowers !== undefined) {
        if (rating.onlyFollowers !== onlyFollowers) {
            rating.onlyFollowers = onlyFollowers
            rating.isEdited = true
        }
    }
    await rating.save()
    
    return NextResponse.json(rating, { status: 200 })
}