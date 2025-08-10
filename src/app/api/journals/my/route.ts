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
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, deleted: false, uid: user._id.toString() }
                  : { deleted: false, uid: user._id.toString() }
    const journals = await Journal.find(query)
                                  .select('-password -replies')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = journals.length === limit ? journals[journals.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: journals,
        nextCursor
    })
}