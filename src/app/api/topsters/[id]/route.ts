import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params // await 해 줘야 됨
    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing topster ID' }), { status: 400 })
    }
    await connectDB()
    
    const topster = await Topster.findById(id).select('-password')
    return NextResponse.json(topster, { status: 200 }) // 200 OK
}