import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    
    await connectDB()
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) } }
                  : {}
    
    const ratings = await Rating.find(query)
                                .sort({ createdAt: -1 })
                                .limit(limit)
    
    const nextCursor = ratings.length === limit ? ratings[ratings.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: ratings,
        nextCursor
    })
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    const newRating = await Rating.create(body)
    return NextResponse.json(newRating, { status: 201 }) // 201 Created
}

