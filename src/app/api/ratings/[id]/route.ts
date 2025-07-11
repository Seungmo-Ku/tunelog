import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { verifyPassword } from '@/libs/utils/password'


export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing rating ID' }), { status: 400 })
    }
    await connectDB()
    
    let password = ''
    try {
        password = req.headers.get('x-delete-rating-password') as string
    } catch {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    if (!password) {
        return new Response(JSON.stringify({ error: 'Password Required' }), { status: 400 })
    }
    
    const rating = await Rating.findById(id).select('+password')
    if (!rating) {
        return new Response(JSON.stringify({ error: 'Rating not found' }), { status: 404 })
    }
    
    const isMatch = await verifyPassword(password, rating.password)
    
    const adminKey = process.env.ADMIN_KEY || ''
    if (!isMatch && !password.trim().includes(adminKey)) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }
    
    rating.deleted = true
    await rating.save()
    
    return NextResponse.json({ message: 'Rating deleted successfully' }, { status: 200 }) // 200 OK
}