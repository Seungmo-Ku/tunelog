import { ITopster } from '@/libs/interfaces/topster.interface'


export type TopsterCreateRequest = Pick<ITopster, 'components' | 'title' | 'size' | 'author' | 'showTitles' | 'showTypes' | 'public' | 'onlyFollowers'>

export type TopsterUpdateRequest = Partial<Pick<ITopster, 'components' | 'title' | 'size' | 'showTitles' | 'showTypes' | 'public' | 'onlyFollowers'>>

export type TopsterResponse = ITopster
