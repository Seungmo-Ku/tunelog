import { NextRequest } from 'next/server'
import { SignJWT } from 'jose'
import { Account } from '@/models/account-schema.model'
import { verifyPassword } from '@/libs/utils/password'
import { connectDB } from '@/libs/api-server/mongoose'


export const POST = async (req: NextRequest) => {
    const body = await req.json()
    const { userid, password } = body
    await connectDB()
    if (!userid || !password) {
        return new Response(JSON.stringify({ error: 'Missing userid or password' }), { status: 400 })
    }
    const account = await Account.findOne({ userid: userid })
    if (!account) {
        return new Response(JSON.stringify({ error: 'Account not found' }), { status: 404 })
    }
    if (!account.isActive) {
        return new Response(JSON.stringify({ error: 'Account is inactive' }), { status: 403 })
    }
    const isMatch = await verifyPassword(password, account.password.toString())
    if (!isMatch) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }
    const token = await new SignJWT({ sub: account._id.toString(), userid: userid })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))
    const response = new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 })
    response.headers.set('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=3600`)
    return response
}