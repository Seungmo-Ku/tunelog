export interface IRecommended {
    readonly _id: string
    type: 'album' | 'artist' | 'track' | 'journal'
    spotifyId: string
    validUntil: Date
    validFrom: Date
    createdAt: Date
    updatedAt: Date
    deleted?: boolean
}

export class Recommended implements IRecommended {
    readonly _id: string
    type: 'album' | 'artist' | 'track' | 'journal'
    spotifyId: string
    validUntil: Date
    validFrom: Date
    createdAt: Date
    updatedAt: Date
    deleted?: boolean
    
    constructor(recommended: IRecommended) {
        this._id = recommended._id
        this.type = recommended.type
        this.spotifyId = recommended.spotifyId
        this.validUntil = recommended.validUntil
        this.validFrom = recommended.validFrom
        this.createdAt = recommended.createdAt
        this.updatedAt = recommended.updatedAt
        this.deleted = recommended.deleted || false
    }
}