import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // createdAt 값 (ISO string)
    const spotifyId = searchParams.get('spotifyId') || ''
    
    await connectDB()
    
    const user = await findUserByCookie()
    
    const userQuery = user ?
        {
            $or: [
                { public: true, onlyFollowers: false },
                { public: true, onlyFollowers: true, uid: { $in: user.followingUids } },
                { uid: user._id.toString() }
            ]
        } :
        {
            public: true, onlyFollowers: false
        }
    
    // 쿼리 조건 구성
    const baseQuery = {
        'subjects.spotifyId': spotifyId,
        deleted: false,
        ...userQuery
    }
    
    const query = cursor ?
        {
            ...baseQuery,
            createdAt: { $lt: new Date(cursor) }
        } : baseQuery
    
    const journals = await Journal.find(query)
                                  .select('-password')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = journals.length === limit
                       ? journals[journals.length - 1].createdAt.toISOString()
                       : null
    
    return NextResponse.json({
        data: journals,
        nextCursor
    })
}