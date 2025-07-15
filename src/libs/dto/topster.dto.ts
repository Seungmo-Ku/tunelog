import { ITopster } from '@/libs/interfaces/topster.interface'


export type TopsterCreateRequest = Pick<ITopster, 'components' | 'title' | 'size' | 'author' | 'showTitles' | 'showTypes' | 'password'>

export type TopsterUpdateRequest = Partial<Pick<ITopster, 'components' | 'title' | 'size' | 'showTitles' | 'showTypes'>> & { password: string }

export type TopsterDeleteRequest = { password: string }

export type TopsterResponse = ITopster
