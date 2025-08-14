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
    const objectTypeFilter = (searchParams.get('type') ?? 'all') as 'journal' | 'rating' | 'topster' | 'all'
    const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'oldest'
    const followingFilter = (searchParams.get('filter') ?? 'all') as 'all' | 'following'
    const uidFilter = (searchParams.get('uid') ?? null) as string | null
    const dateFilter = searchParams.get('date') as string | null
    
    await connectDB()
    
    const sortDirection = sort === 'newest' ? -1 : 1
    
    const createdAtQuery: Record<string, Date> = {}
    
    if (cursor) {
        createdAtQuery[sort === 'newest' ? '$lt' : '$gt'] = new Date(cursor)
    }
    
    const user = await findUserByCookie()
    if (!user && followingFilter === 'following') {
        return NextResponse.json({
            data: [],
            nextCursor: null
        })
    }
    const deletionQuery = { deleted: false }
    const accessConditionQuery = user ? [
        { public: true, onlyFollowers: false },
        { public: true, onlyFollowers: true, uid: { $in: user.followingUids } },
        { uid: user._id.toString() }
    ] : [
        { public: true, onlyFollowers: false }
    ]
    const uidQuery = uidFilter ? { uid: uidFilter } : {}
    
    if (dateFilter) {
        const [year, month] = dateFilter.split('-').map(Number)
        const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0)
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)
        
        createdAtQuery['$gte'] = startOfMonth
        createdAtQuery['$lte'] = endOfMonth
    }
    
    const baseQuery = {
        ...deletionQuery,
        ...uidQuery,
        $or: accessConditionQuery
    }
    const userQuery = (followingFilter === 'all' || !user) ? {} : { uid: { $in: user.followingUids } }
    
    const finalQuery = {
        ...baseQuery,
        ...userQuery,
        ...(Object.keys(createdAtQuery).length > 0 ? { createdAt: createdAtQuery } : {})
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[] = []
    
    if (objectTypeFilter === 'all') {
        const pipeline: PipelineStage[] = [
            { $match: finalQuery },
            { $addFields: { itemType: 'rating' } },
            { $project: { password: 0, replies: 0 } },
            {
                $unionWith: {
                    coll: 'journals',
                    pipeline: [
                        { $match: finalQuery },
                        { $addFields: { itemType: 'journal' } },
                        { $project: { password: 0, replies: 0 } }
                    ]
                }
            },
            {
                $unionWith: {
                    coll: 'topsters',
                    pipeline: [
                        { $match: finalQuery },
                        { $addFields: { itemType: 'topster' } },
                        { $project: { password: 0, replies: 0 } }
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
        switch (objectTypeFilter) {
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
                                    .select('-password -replies')
                                    .sort({ createdAt: sortDirection })
                                    .limit(limit)
                                    .lean()
            
            results = data.map((object) => ({ itemType: objectTypeFilter, item: object }))
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