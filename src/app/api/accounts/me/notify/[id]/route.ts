import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { findUserIdByCookie } from '@/libs/utils/user-id'
import { Account } from '@/models/account-schema.model'
import mongoose from 'mongoose'


export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectDB()
    const { id } = await params
    const uid = await findUserIdByCookie()
    if (!uid) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    } else {
        try {
            await Account.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(uid), 'notify._id': new mongoose.Types.ObjectId(id) },
                { $set: { 'notify.$.checked': true } }
            )
            return NextResponse.json({ status: 200 })
        } catch (error) {
            console.error('Error updating checked notification:', error)
            throw error
        }
    }
}