import { IRating } from '@/libs/interfaces/rating.interface'


export type RatingCreateRequest = Pick<IRating, 'type' | 'spotifyId' | 'score' | 'comment' | 'author' | 'password' | 'public'>

export type RatingUpdateRequest = Partial<Pick<IRating, 'score' | 'comment'>>

export type RatingDeleteRequest = { password: string }

export type RatingResponse = IRating

export interface DataConnection<T> {
    data: T[]
    nextCursor?: string
}