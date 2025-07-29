import { NextRequest } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { Account } from '@/models/account-schema.model'


export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    
    await connectDB()
    if (!id) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    const user = await Account.findById(id)
    if (!user || !user.isActive) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }
    const newUser = user.toObject()
    delete newUser.password
    return new Response(JSON.stringify(newUser), { status: 200 })
}