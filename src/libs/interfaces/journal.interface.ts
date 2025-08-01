import { RatingType } from '@/libs/constants/rating.constant'
import { IReply } from '@/libs/interfaces/rating.interface'


export interface Subject {
    type: RatingType
    spotifyId: string
}

export interface Tags {
    weather?: string
    mood?: string
    scene?: string
    custom?: string
}

export interface IJournal {
    readonly _id: string
    subjects: Subject[]
    title: string
    content: string
    tags?: Tags
    createdAt: Date
    updatedAt: Date
    author?: string
    isEdited?: boolean
    likedUids?: string[]
    replies?: IReply[]
    deleted?: boolean
    public?: boolean
    uid: string
}

export class Journal implements IJournal {
    readonly _id: string
    subjects: Subject[]
    title: string
    content: string
    tags?: Tags
    createdAt: Date
    updatedAt: Date
    author?: string
    isEdited?: boolean
    likedUids?: string[]
    replies?: IReply[]
    deleted?: boolean
    public?: boolean
    uid: string
    
    constructor(data: Partial<IJournal>) {
        this._id = data._id || ''
        this.subjects = data.subjects || []
        this.title = data.title || ''
        this.content = data.content || ''
        this.tags = data.tags || {}
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
        this.author = data.author || ''
        this.isEdited = data.isEdited || false
        this.likedUids = data.likedUids || []
        this.replies = data.replies || []
        this.deleted = data.deleted || false
        this.public = data.public || false
        this.uid = data.uid || ''
    }
}

export type JournalByMonth = Record<string, Journal[]>