import { connectDB } from '@/libs/api-server/mongoose'
import { findUserIdByCookie } from '@/libs/utils/user-id'
import { Account } from '@/models/account-schema.model'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { isEmpty } from 'lodash'


export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!, 10) : 4
    const cursor = searchParams.get('cursor')
    await connectDB()
    const uid = await findUserIdByCookie()
    if (!uid) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    } else {
        try {
            const results = await Account.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(uid)
                    }
                },
                { $unwind: '$notify' },
                { $replaceRoot: { newRoot: '$notify' } },
                { $match: cursor ? { createdAt: { $lt: new Date(cursor) } } : {} },
                { $sort: { createdAt: -1 } },
                { $limit: limit }
            ])
            const nextCursor =
                results.length === limit && results[results.length - 1]?.createdAt
                ? results[results.length - 1].createdAt.toISOString()
                : null
            return Response.json({
                data: results,
                nextCursor
            })
        } catch (error) {
            console.error('Error fetching notifications:', error)
            throw error
        }
    }
}