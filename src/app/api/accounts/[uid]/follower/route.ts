import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Account } from '@/models/account-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await Account.findById(uid)
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, isActive: true, _id: { $in: user.followerUids } }
                  : { isActive: true, _id: { $in: user.followerUids } }
    const accounts = await Account.find(query)
                                  .select('-password')
                                  .sort({ createdAt: -1 })
                                  .limit(limit)
    
    const nextCursor = accounts.length === limit ? accounts[accounts.length - 1].createdAt.toISOString() : null
    
    return NextResponse.json({
        data: accounts,
        nextCursor
    })
}