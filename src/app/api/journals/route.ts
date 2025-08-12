import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'
import { findUserByCookie } from '@/libs/utils/password'
import { PipelineStage } from 'mongoose'
import { Account } from '@/models/account-schema.model'


export const GET = async (req: NextRequest) => { // 모든 rating 가져오기
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const sort = (searchParams.get('sort') ?? 'newest') as 'newest' | 'likes'
    
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    
    const match = {
        deleted: false,
        public: true,
        onlyFollowers: false
    }
    // TODO. pagenation 이 필요해지면 nextCursor 사용
    if (sort === 'likes') {
        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $addFields: {
                    likeCount: { $size: '$likedUids' } // likedUids 배열의 크기를 likeCount로 추가해서 내림차순 정렬
                }
            },
            {
                $sort: {
                    likeCount: -1,
                    createdAt: -1
                }
            },
            {
                $limit: limit
            }
        ]
        
        const journals = await Journal.aggregate(pipeline)
        
        return NextResponse.json({
            data: journals,
            nextCursor: null
        })
    }
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, ...match }
                  : match
    const journals = await Journal.find(query)
                                  .select('-password -replies')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = journals.length === limit ? journals[journals.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: journals,
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
    const newJournal = await Journal.create(body)
    const object = newJournal.toObject()
    if (object.public || object.onlyFollowers) {
        await Promise.all(
            user.followerUids.map(async (uid: string) => {
                const notify = {
                    info: 'new_from_following',
                    name: user.name,
                    type: `Journal - ${object.title}`,
                    link: `/journals/${object._id}`,
                    uid: object.uid
                }
                await Account.updateOne({ _id: uid }, { $push: { notify } })
            })
        )
    }
    return NextResponse.json(object, { status: 201 }) // 201 Created
}
