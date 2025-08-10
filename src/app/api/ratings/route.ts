import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    const type = (searchParams.get('type') ?? 'all') as 'album' | 'artist' | 'track' | 'all'
    const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'oldest'
    
    await connectDB()
    
    const queryBase = type === 'all' ? { deleted: false, public: true, onlyFollowers: false } : { deleted: false, public: true, onlyFollowers: false, type }
    const sortDirection = sort === 'newest' ? -1 : 1
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, ...queryBase }
                  : { ...queryBase }
    
    const ratings = await Rating.find(query)
                                .select('-password -replies')
                                .sort({ createdAt: sortDirection })
                                .limit(limit)
    
    const nextCursor = ratings.length === limit ? ratings[ratings.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: ratings,
        nextCursor
    })
}

export const POST = async (req: NextRequest) => {
    await connectDB()
    const user = await findUserByCookie()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    body.uid = user._id.toString()
    const newRating = await Rating.create(body)
    const object = newRating.toObject()
    delete object.password
    return NextResponse.json(object, { status: 201 }) // 201 Created
}

