import { connectDB } from '@/libs/api-server/mongoose'
import { findUserIdByCookie } from '@/libs/utils/user-id'
import { Account } from '@/models/account-schema.model'
import mongoose from 'mongoose'


export const GET = async () => {
    await connectDB()
    const uid = await findUserIdByCookie()
    if (!uid) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    } else {
        try {
            const notifyArray = await Account.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(uid)
                    }
                },
                {
                    $unwind: '$notify'
                },
                {
                    $match: {
                        'notify.checked': false
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$notify'
                    }
                }
            ])
            return Response.json(notifyArray)
        } catch (error) {
            console.error('Error fetching unchecked notifications:', error)
            throw error
        }
    }
}