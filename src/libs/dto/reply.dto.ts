import { IReply } from '@/libs/interfaces/rating.interface'


export type ReplyCreateRequest = Pick<IReply, 'comment' | 'author'>

export type ReplyResponse = IReply