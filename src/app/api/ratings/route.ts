import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'


export const GET = async () => { // 모든 rating 가져오기
    await connectDB()
    const ratings = await Rating.find()
    return NextResponse.json(ratings)
}

export const POST = async (request: NextRequest) => {
    await connectDB()
    const body = await request.json()
    console.log('POST /api/ratings', body)
    const newRating = await Rating.create(body)
    return NextResponse.json(newRating, { status: 201 }) // 201 Created
}

