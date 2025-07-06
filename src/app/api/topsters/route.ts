import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'


export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    const newTopster = await Topster.create(body)
    return NextResponse.json(newTopster, { status: 201 }) // 201 Created
}