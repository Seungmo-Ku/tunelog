import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'
import { verifyPassword } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing topster ID' }), { status: 400 })
    }
    await connectDB()
    
    const topster = await Topster.findOne({ _id: id, deleted: false }).select('-password')
    return NextResponse.json(topster, { status: 200 }) // 200 OK
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing topster ID' }), { status: 400 })
    }
    await connectDB()
    
    let password = ''
    try {
        password = req.headers.get('x-delete-topster-password') as string
    } catch {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    if (!password) {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    const topster = await Topster.findById(id).select('+password')
    if (!topster) {
        return new Response(JSON.stringify({ error: 'Topster not found' }), { status: 404 })
    }
    
    const isMatch = await verifyPassword(password, topster.password)
    
    const adminKey = process.env.ADMIN_KEY || ''
    if (!isMatch && password.trim() !== adminKey) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }
    
    topster.deleted = true
    await topster.save()
    
    return NextResponse.json({ message: 'Topster deleted successfully' }, { status: 200 }) // 200 OK
}