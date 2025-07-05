import { connectDB } from '@/libs/api-server/mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { Recommended } from '@/models/recommended-schema.model'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    
    await connectDB()
    
    const query = {
        validFrom: { $lt: new Date() },
        deleted: false,
        $or: [
            { validUntil: { $gt: new Date() } }, // 유효 기간이 아직 남았거나
            { validUntil: null }                // 유효 기간이 null (무제한)인 경우
        ]
    }
    
    const recommended = await Recommended.find(query).sort({ createdAt: -1 }).limit(limit)
    
    return NextResponse.json(recommended, { status: 200 }) // 200 OK
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    const newRating = await Recommended.create(body)
    return NextResponse.json(newRating, { status: 201 }) // 201 Created
}

