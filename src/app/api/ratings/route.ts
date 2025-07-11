import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { hashPassword } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    
    await connectDB()
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, deleted: false }
                  : { deleted: false }
    
    const ratings = await Rating.find(query)
                                .select('-password') // 비밀번호는 제외
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
    if (body.password && !isEmpty(body.password)) {
        body.password = await hashPassword(body.password)
    } else delete body.password
    const newRating = await Rating.create(body)
    const object = newRating.toObject()
    delete object.password
    return NextResponse.json(object, { status: 201 }) // 201 Created
}

