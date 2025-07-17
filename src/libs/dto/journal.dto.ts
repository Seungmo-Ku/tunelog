import { IJournal } from '@/libs/interfaces/journal.interface'


export type JournalCreateRequest = Pick<IJournal, 'subjects' | 'title' | 'content' | 'tags' | 'author' | 'public'>

export type JournalUpdateRequest = Partial<Pick<IJournal, 'title' | 'content' | 'tags' | 'subjects' | 'public'>>

export type JournalDeleteRequest = { password: string }

export type JournalResponse = IJournal