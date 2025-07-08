import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'
import { isEmpty } from 'lodash'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) } }
                  : {}
    const topsters = await Topster.find(query).sort({ createdAt: -1 }).limit(limit)
    
    const nextCursor = topsters.length === limit ? topsters[topsters.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: topsters,
        nextCursor
    })
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    const newTopster = await Topster.create(body)
    return NextResponse.json(newTopster, { status: 201 }) // 201 Created
}