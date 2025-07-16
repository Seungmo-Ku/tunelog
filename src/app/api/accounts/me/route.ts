import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { Account } from '@/models/account-schema.model'


export const GET = async () => {
    const cookie = await cookies()
    const token = cookie.get('auth')?.value
    if (!token) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })
    }
    let payload
    try {
        const secret = process.env.JWT_SECRET
        if (!secret) {
            throw new Error('JWT_SECRET is not defined')
        }
        const { payload: verified } = await jwtVerify(token, new TextEncoder().encode(secret))
        payload = verified
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    }
    
    const user = await Account.findById(payload.sub).select('-password')
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }
    return new Response(JSON.stringify(user), { status: 200 })
}