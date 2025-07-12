import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { verifyPassword } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing journal ID' }), { status: 400 })
    }
    await connectDB()
    
    const journal = await Journal.find({ deleted: false }).findById(id).select('-password')
    return NextResponse.json(journal, { status: 200 }) // 200 OK
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing journal ID' }), { status: 400 })
    }
    await connectDB()
    
    let password = ''
    try {
        password = req.headers.get('x-delete-journal-password') as string
    } catch {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    if (!password) {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    const journal = await Journal.findById(id).select('+password')
    if (!journal) {
        return new Response(JSON.stringify({ error: 'Journal not found' }), { status: 404 })
    }
    
    const isMatch = await verifyPassword(password, journal.password)
    
    const adminKey = process.env.ADMIN_KEY || ''
    if (!isMatch && password.trim() !== adminKey) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }
    
    journal.deleted = true
    await journal.save()
    
    return NextResponse.json({ message: 'Journal deleted successfully' }, { status: 200 }) // 200 OK
}