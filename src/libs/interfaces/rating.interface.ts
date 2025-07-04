import { RatingType } from '@/libs/constants/rating.constant'


export interface IReply {
    readonly _id: string
    comment: string
    author?: string
    createdAt: Date
    updatedAt: Date
    isEdited?: boolean
    likes?: number
    deleted?: boolean
} // 댓글

export interface IRating {
    readonly _id: string
    type: RatingType
    spotifyId: string
    score: number
    comment: string
    createdAt: Date
    updatedAt: Date
    author?: string
    isEdited?: boolean
    likes?: number
    replies?: IReply[]
    deleted?: boolean
} // Rating

export class Reply implements IReply {
    readonly _id: string
    comment: string
    author?: string
    createdAt: Date
    updatedAt: Date
    isEdited?: boolean
    likes?: number
    deleted?: boolean

    constructor(reply: IReply) {
        this._id = reply._id
        this.comment = reply.comment
        this.author = reply.author
        this.createdAt = reply.createdAt
        this.updatedAt = reply.updatedAt
        this.isEdited = reply.isEdited || false
        this.likes = reply.likes || 0
        this.deleted = reply.deleted || false
    }
}

export class Rating implements IRating {
    readonly _id: string
    type: RatingType
    spotifyId: string
    score: number
    comment: string
    createdAt: Date
    updatedAt: Date
    author?: string
    isEdited?: boolean
    likes?: number
    replies?: IReply[]
    deleted?: boolean

    constructor(rating: IRating) {
        this._id = rating._id
        this.type = rating.type
        this.spotifyId = rating.spotifyId
        this.score = rating.score
        this.comment = rating.comment.replaceAll('\\n', '\n') // Ensure newlines are preserved
        this.createdAt = rating.createdAt
        this.updatedAt = rating.updatedAt
        this.author = rating.author || ''
        this.isEdited = rating.isEdited || false
        this.likes = rating.likes || 0
        this.replies = rating.replies?.map(reply => new Reply(reply)) || []
        this.deleted = rating.deleted || false
    }
}