import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Topster } from '@/models/topster-schema.model'
import { isEmpty } from 'lodash'
import { hashPassword } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, deleted: false }
                  : { deleted: false }
    const topsters = await Topster.find(query)
                                  .select('-password')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = topsters.length === limit ? topsters[topsters.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: topsters,
        nextCursor
    })
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    if (body.password && !isEmpty(body.password)) {
        body.password = await hashPassword(body.password)
    } else delete body.password
    const newTopster = await Topster.create(body)
    const object = newTopster.toObject()
    delete object.password
    return NextResponse.json(object, { status: 201 }) // 201 Created
}