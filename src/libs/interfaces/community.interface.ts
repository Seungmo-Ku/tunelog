import { Rating } from '@/libs/interfaces/rating.interface'
import { Journal } from '@/libs/interfaces/journal.interface'
import { Topster } from '@/libs/interfaces/topster.interface'


export interface CommunityItem {
    type: 'rating' | 'journal' | 'topster'
    item?: Rating | Journal | Topster
}