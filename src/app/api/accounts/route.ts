import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { isEmpty } from 'lodash'
import { hashPassword } from '@/libs/utils/password'
import { Account } from '@/models/account-schema.model'
import { SignJWT } from 'jose'


export const POST = async (req: NextRequest) => {
    await connectDB()
    const body = await req.json()
    const existingAccount = await Account.findOne({ userid: body.userid })
    if (existingAccount) {
        return NextResponse.json({ error: 'Account already exists' }, { status: 409 }) // 409 Conflict
    }
    if (body.password && !isEmpty(body.password)) {
        body.password = await hashPassword(body.password)
    } else delete body.password
    const newAccount = await Account.create(body)
    const token = await new SignJWT({ sub: newAccount._id.toString(), userid: newAccount.userid.toString() })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))
    const response = new Response(JSON.stringify({ message: 'Register and Login successful' }), { status: 201 })
    response.headers.set('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=3600`)
    return response
}
