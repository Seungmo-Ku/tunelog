import { IRating } from '@/libs/interfaces/rating.interface'


export type RatingCreateRequest = Pick<IRating, 'type' | 'spotifyId' | 'score' | 'comment' | 'author' | 'public'>

export type RatingUpdateRequest = Partial<Pick<IRating, 'public'>>

export type RatingResponse = IRating

export interface DataConnection<T> {
    data: T[]
    nextCursor?: string
}