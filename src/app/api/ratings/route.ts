import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'


export const GET = async () => { // 모든 rating 가져오기
    await connectDB()
    const ratings = await Rating.find() // find().limit() -> limit을 걸고 싶으면 쿼리 파라미터로 받아서 처리해야 함
    // const ratings = await Rating.find().sort({ updatedAt: -1 }) -1: 내림차순, 1: 오름차순
    return NextResponse.json(ratings)
}

export const POST = async (request: NextRequest) => {
    await connectDB()
    const body = await request.json()
    console.log('POST /api/ratings', body)
    const newRating = await Rating.create(body)
    return NextResponse.json(newRating, { status: 201 }) // 201 Created
}

