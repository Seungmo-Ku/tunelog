import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, deleted: false, public: true }
                  : { deleted: false, public: true }
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
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    body.uid = user._id.toString()
    const newJournal = await Journal.create(body)
    const object = newJournal.toObject()
    return NextResponse.json(object, { status: 201 }) // 201 Created
}
