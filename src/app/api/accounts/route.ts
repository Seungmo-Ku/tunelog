import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/libs/api-server/mongoose'
import { isEmpty } from 'lodash'
import { hashPassword } from '@/libs/utils/password'
import { Account } from '@/models/account-schema.model'


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
    const object = newAccount.toObject()
    delete object.password
    return NextResponse.json(object, { status: 201 }) // 201 Created
}
