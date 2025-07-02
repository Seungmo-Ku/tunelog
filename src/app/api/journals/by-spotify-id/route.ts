import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Journal } from '@/models/journal-schema.model'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor') // createdAt 값 (ISO string)
    const spotifyId = searchParams.get('spotifyId') || ''
    
    await connectDB()
    
    // 쿼리 조건 구성
    const baseQuery = {
        'subjects.spotifyId': spotifyId
    }
    
    const query = cursor ?
        {
            ...baseQuery,
            createdAt: { $lt: new Date(cursor) }
        } : baseQuery
    
    const journals = await Journal.find(query)
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = journals.length === limit
                       ? journals[journals.length - 1].createdAt.toISOString()
                       : null
    
    return NextResponse.json({
        data: journals,
        nextCursor
    })
}