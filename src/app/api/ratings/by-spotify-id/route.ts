import { NextRequest, NextResponse } from 'next/server'
import isEmpty from 'lodash/isEmpty'
import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // createdAt 값 (ISO string)
    const spotifyId = !isEmpty(searchParams.get('spotifyId')) ? searchParams.get('spotifyId')! : '' // 추가
    
    await connectDB()
    
    // 쿼리 객체 생성
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, spotifyId }
                  : { spotifyId }
    
    const ratings = await Rating.find(query)
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
