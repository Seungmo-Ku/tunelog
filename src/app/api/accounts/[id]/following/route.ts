import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Account } from '@/models/account-schema.model'
import { findUserByCookie } from '@/libs/utils/password'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const limit = !isEmpty(searchParams.get('limit')) ? parseInt(searchParams.get('limit')!) : 10
    const cursor = searchParams.get('cursor')
    
    await connectDB()
    if (!id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await Account.findById(id)
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const query = cursor
                  ? { createdAt: { $lt: new Date(cursor) }, isActive: true, _id: { $in: user.followingUids } }
                  : { isActive: true, _id: { $in: user.followingUids } }
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

export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const followingUser = await findUserByCookie()
    if (!followingUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const followedUser = await Account.findById(id)
    if (!followedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (followingUser._id.toString() === followedUser._id.toString()) {
        return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }
    if (followedUser.followerUids.includes(followingUser._id.toString())) {
        return NextResponse.json({ error: 'Already following this user' }, { status: 400 })
    }
    if (followedUser.isActive === false) {
        return NextResponse.json({ error: 'User is not active' }, { status: 400 })
    }
    followedUser.followerUids.push(followingUser._id.toString())
    followingUser.followingUids.push(followedUser._id.toString())
    await followedUser.save()
    await followingUser.save()
    return NextResponse.json({ message: 'Followed successfully' }, { status: 201 })
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const followingUser = await findUserByCookie()
    if (!followingUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const followedUser = await Account.findById(id)
    if (!followedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (followingUser._id.toString() === followedUser._id.toString()) {
        return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 })
    }
    if (!followedUser.followerUids.includes(followingUser._id.toString())) {
        return NextResponse.json({ error: 'Not following this user' }, { status: 400 })
    }
    
    followedUser.followerUids = followedUser.followerUids.filter((uid: string) => uid !== followingUser._id.toString())
    followingUser.followingUids = followingUser.followingUids.filter((uid: string) => uid !== followedUser._id.toString())
    
    await followedUser.save()
    await followingUser.save()
    
    return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 })
}