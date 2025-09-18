import { NextRequest } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Account } from '@/models/account-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ uid: string }> }) => {
    const { uid } = await params
    
    await connectDB()
    if (!uid) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    const user = await Account.findById(uid).select('-password -notify')
    if (!user || !user.isActive) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }
    const newUser = user.toObject()
    return new Response(JSON.stringify(newUser), { status: 200 })
}