import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { isEmpty } from 'lodash'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // createdAt 값 (ISO string)
    const spotifyId = !isEmpty(searchParams.get('spotifyId')) ? searchParams.get('spotifyId')! : '' // 추가
    
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
    
    // 쿼리 객체 생성
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, spotifyId, deleted: false, ...userQuery }
                  : { spotifyId, deleted: false, ...userQuery }
    
    const ratings = await Rating.find(query)
                                .select('-password -replies') // 비밀번호는 제외
                                .sort({ createdAt: -1 })
                                .limit(limit)
    
    const nextCursor = ratings.length === limit
                       ? ratings[ratings.length - 1].createdAt.toISOString()
                       : null
    
    return NextResponse.json({
        data: ratings,
        nextCursor
    })
}
