import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserByCookie } from '@/libs/utils/password'
import { Topster } from '@/models/topster-schema.model'


export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const topster = await Topster.findById(id)
    if (!topster) {
        return NextResponse.json({ error: 'Topster not found' }, { status: 404 })
    }
    if (topster.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'Already liked' }, { status: 400 }) // 400 Bad Request
    }
    topster.likedUids.push(user._id.toString())
    await topster.save()
    return NextResponse.json('OK', { status: 200 })
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const topster = await Topster.findById(id)
    if (!topster) {
        return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }
    if (!topster.likedUids.includes(user._id.toString())) {
        return NextResponse.json({ error: 'No likes by user' }, { status: 400 }) // 400 Bad Request
    }
    topster.likedUids = topster.likedUids.filter((uid: string) => uid !== user._id.toString())
    await topster.save()
    return NextResponse.json('OK', { status: 200 })
}