import { IJournal } from '@/libs/interfaces/journal.interface'


export type JournalCreateRequest = Pick<IJournal, 'subjects' | 'title' | 'content' | 'tags' | 'author' | 'public' | 'onlyFollowers'>

export type JournalUpdateRequest = Partial<Pick<IJournal, 'title' | 'content' | 'tags' | 'subjects' | 'public' | 'onlyFollowers'>>

export type JournalResponse = IJournal