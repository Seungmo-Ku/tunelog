import { IRating } from '@/libs/interfaces/rating.interface'
import { IJournal } from '@/libs/interfaces/journal.interface'
import { ITopster } from '@/libs/interfaces/topster.interface'


export interface CommunityResponse {
    itemType: 'rating' | 'journal' | 'topster'
    item: IRating | IJournal | ITopster
}