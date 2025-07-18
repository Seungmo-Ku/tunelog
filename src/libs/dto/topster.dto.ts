import { ITopster } from '@/libs/interfaces/topster.interface'


export type TopsterCreateRequest = Pick<ITopster, 'components' | 'title' | 'size' | 'author' | 'showTitles' | 'showTypes' | 'public'>

export type TopsterUpdateRequest = Partial<Pick<ITopster, 'components' | 'title' | 'size' | 'showTitles' | 'showTypes' | 'public'>>

export type TopsterResponse = ITopster
