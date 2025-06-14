import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    await connectDB()
    const ratings = await Rating.find().sort({ updatedAt: -1 }).limit(limit) // find().limit() -> limit을 걸고 싶으면 쿼리 파라미터로 받아서 처리해야 함
    return NextResponse.json(ratings)
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    console.log('POST /api/ratings', body)
    const newRating = await Rating.create(body)
    return NextResponse.json(newRating, { status: 201 }) // 201 Created
}

