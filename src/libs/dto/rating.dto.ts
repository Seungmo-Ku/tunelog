import { IRating } from '@/libs/interfaces/rating.interface'


export type RatingCreateRequest = Pick<IRating, 'type' | 'spotifyId' | 'score' | 'comment' | 'author' | 'public' | 'onlyFollowers'>

export type RatingUpdateRequest = Partial<Pick<IRating, 'public' | 'onlyFollowers'>>

export type RatingResponse = IRating

export interface DataConnection<T> {
    data: T[]
    nextCursor?: string
}