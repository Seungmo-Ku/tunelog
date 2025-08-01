import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Rating } from '@/models/rating-schema.model'
import { Journal } from '@/models/journal-schema.model'
import { Topster } from '@/models/topster-schema.model'
import { PipelineStage } from 'mongoose'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest) => { // 모든 커뮤니티 게시글 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!, 10) : 10
    const cursor = searchParams.get('cursor') // updatedAt 값 (ISO string)
    const type = (searchParams.get('type') ?? 'all') as 'journal' | 'rating' | 'topster' | 'all'
    const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'oldest'
    const filter = (searchParams.get('filter') ?? 'all') as 'all' | 'following'
    
    await connectDB()
    
    const queryBase = { deleted: false, public: true }
    const sortDirection = sort === 'newest' ? -1 : 1
    
    const cursorQuery = cursor
                        ? { createdAt: { [sort === 'newest' ? '$lt' : '$gt']: new Date(cursor) } }
                        : {}
    
    const user = await findUserByCookie()
    const userQuery = (filter === 'all' || !user) ? {} : { uid: { $in: user.followingUids } }
    
    const finalQuery = { ...queryBase, ...cursorQuery, ...userQuery }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[] = []
    
    if (type === 'all') {
        const pipeline: PipelineStage[] = [
            { $match: finalQuery },
            { $addFields: { itemType: 'rating' } },
            { $project: { password: 0 } },
            {
                $unionWith: {
                    coll: 'journals',
                    pipeline: [
                        { $match: finalQuery },
                        { $addFields: { itemType: 'journal' } },
                        { $project: { password: 0 } }
                    ]
                }
            },
            {
                $unionWith: {
                    coll: 'topsters',
                    pipeline: [
                        { $match: finalQuery },
                        { $addFields: { itemType: 'topster' } },
                        { $project: { password: 0 } }
                    ]
                }
            },
            { $sort: { createdAt: sortDirection } },
            { $limit: limit }
        ]
        
        results = await Rating.aggregate(pipeline)
        results = results.map(({ itemType, ...rest }) => ({
            itemType,
            item: { ...rest }
        }))
    } else {
        let model
        switch (type) {
            case 'rating':
                model = Rating
                break
            case 'journal':
                model = Journal
                break
            case 'topster':
                model = Topster
                break
        }
        
        if (model) {
            const data = await model.find(finalQuery)
                                    .select('-password')
                                    .sort({ createdAt: sortDirection })
                                    .limit(limit)
                                    .lean()
            
            results = data.map((object) => ({ itemType: type, item: object }))
        }
    }
    
    const nextCursor =
        results.length === limit && results[results.length - 1]?.item?.createdAt
        ? results[results.length - 1].item.createdAt.toISOString()
        : null
    
    return NextResponse.json({
        data: results,
        nextCursor
    })
}