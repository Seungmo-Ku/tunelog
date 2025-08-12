export interface INotify {
    readonly _id: string
    info: string
    name?: string
    type?: string
    link?: string
    createdAt: Date
    updatedAt: Date
}

export interface IAccount {
    readonly _id: string
    userid: string
    name: string
    password?: string
    createdAt: Date
    updatedAt: Date
    followingUids?: string[]
    followerUids?: string[]
    notify?: INotify[]
}

export class Notify implements INotify {
    readonly _id: string
    info: string
    name?: string
    type?: string
    link?: string
    createdAt: Date
    updatedAt: Date
    
    constructor(data: INotify) {
        this._id = data._id
        this.info = data.info
        this.name = data.name || ''
        this.type = data.type || ''
        this.link = data.link || ''
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
    }
}

export class Account implements IAccount {
    readonly _id: string
    userid: string
    name: string
    createdAt: Date
    updatedAt: Date
    followingUids?: string[]
    followerUids?: string[]
    notify?: INotify[]
    
    constructor(data: IAccount) {
        this._id = data._id
        this.userid = data.userid
        this.name = data.name
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.followingUids = data.followingUids || []
        this.followerUids = data.followerUids || []
        this.notify = data.notify ? data.notify.map(notify => new Notify(notify)) : []
    }
}

export interface IObjectCount {
    ratingCount: number
    journalCount: number
    topsterCount: number
}