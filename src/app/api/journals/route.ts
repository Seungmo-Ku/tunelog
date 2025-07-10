import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { hashPassword } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) } }
                  : {}
    const journals = await Journal.find(query)
                                  .select('-password')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = journals.length === limit ? journals[journals.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: journals,
        nextCursor
    })
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    if (body.password) {
        body.password = await hashPassword(body.password)
    }
    const newJournal = await Journal.create(body)
    return NextResponse.json(newJournal, { status: 201 }) // 201 Created
}
