export interface IAccount {
    readonly _id: string
    userid: string
    name: string
    password?: string
    createdAt: Date
    updatedAt: Date
}

export class Account implements IAccount {
    readonly _id: string
    userid: string
    name: string
    createdAt: Date
    updatedAt: Date

    constructor(data: IAccount) {
        this._id = data._id
        this.userid = data.userid
        this.name = data.name
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }
}