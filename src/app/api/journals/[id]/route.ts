import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing journal ID' }), { status: 400 })
    }
    await connectDB()
    
    const journal = await Journal.findById(id).select('-password')
    return NextResponse.json(journal, { status: 200 }) // 200 OK
}