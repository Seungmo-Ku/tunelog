import { SearchType } from '@/libs/constants/spotify.constant'
import { IReply } from '@/libs/interfaces/rating.interface'


export interface TopsterComponent {
    type: SearchType,
    spotifyId: string,
    imageUrl: string,
    title: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface ITopster {
    readonly _id: string,
    components: TopsterComponent[],
    title: string,
    size: number,
    author: string,
    showTitles?: boolean,
    showTypes?: boolean,
    isEdited?: boolean,
    likes?: number,
    replies?: IReply[],
    deleted?: boolean,
    createdAt: Date,
    updatedAt: Date,
    password?: string
}

export class Topster implements ITopster {
    readonly _id: string
    components: TopsterComponent[]
    title: string
    size: number
    author: string
    showTitles?: boolean
    showTypes?: boolean
    isEdited?: boolean
    likes?: number
    replies?: IReply[]
    deleted?: boolean
    createdAt: Date
    updatedAt: Date
    
    constructor(data: Partial<ITopster>) {
        this._id = data._id || ''
        this.components = data.components || []
        this.title = data.title || ''
        this.size = data.size || 0
        this.author = data.author || ''
        this.showTitles = data.showTitles || false
        this.showTypes = data.showTypes || false
        this.isEdited = data.isEdited || false
        this.likes = data.likes || 0
        this.replies = data.replies || []
        this.deleted = data.deleted || false
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
    }
}