import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => { // 모든 rating 가져오기
    const { uid } = await params
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    const user = await findUserByCookie()
    const queryUser = (!user || (user._id.toString() !== uid)) ? { deleted: false, uid: uid, public: true } : { deleted: false, uid: uid }
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, ...queryUser }
                  : queryUser
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