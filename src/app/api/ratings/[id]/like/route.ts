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
    if (rating.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'Already liked' }, { status: 400 }) // 400 Bad Request
    }
    rating.likedUids.push(user._id.toString())
    await rating.save()
    return NextResponse.json('OK', { status: 200 })
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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
    if (!rating.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'No likes by user' }, { status: 400 }) // 400 Bad Request
    }
    rating.likedUids = rating.likedUids.filter((uid: string) => uid !== user._id.toString())
    await rating.save()
    return NextResponse.json('OK', { status: 200 })
}