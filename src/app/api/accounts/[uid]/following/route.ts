import { NextRequest, NextResponse } from 'next/server'
import { isEmpty } from 'lodash'
import { connectDB } from '@/libs/api-server/mongoose'
import { Account } from '@/models/account-schema.model'
import { findUserByCookie } from '@/libs/utils/password'
import { INotify } from '@/libs/interfaces/account.interface'


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

export const POST = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const followingUser = await findUserByCookie()
    if (!followingUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const followedUser = await Account.findById(uid)
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
    const newNotifyOnFollowing = {
        info: 'notify.following',
        name: followedUser.name,
        uid: followedUser._id.toString(),
        link: `accounts/${followedUser._id.toString()}`
    }
    const newNotifyOnFollowed = {
        info: 'notify.followed',
        name: followingUser.name,
        uid: followingUser._id.toString(),
        link: `accounts/${followingUser._id.toString()}`
    }
    followingUser.notify.push(newNotifyOnFollowing)
    followedUser.notify.push(newNotifyOnFollowed)
    await followedUser.save()
    await followingUser.save()
    return NextResponse.json({ message: 'Followed successfully' }, { status: 201 })
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const followingUser = await findUserByCookie()
    if (!followingUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const followedUser = await Account.findById(uid)
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
    
    followedUser.notify = followedUser.notify.filter((notify: Partial<INotify>) => !(notify?.uid === followingUser._id.toString() && notify?.info === 'notify.followed'))
    followingUser.notify = followingUser.notify.filter((notify: Partial<INotify>) => !(notify?.uid === followedUser._id.toString() && notify?.info === 'notify.following'))
    
    await followedUser.save()
    await followingUser.save()
    
    return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 })
}