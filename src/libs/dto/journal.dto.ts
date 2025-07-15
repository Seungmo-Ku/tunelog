import { IJournal } from '@/libs/interfaces/journal.interface'


export type JournalCreateRequest = Pick<IJournal, 'subjects' | 'title' | 'content' | 'tags' | 'author' | 'password'>

export type JournalUpdateRequest = Partial<Pick<IJournal, 'title' | 'content' | 'tags' | 'subjects'>> & { password: string }

export type JournalDeleteRequest = { password: string }

export type JournalResponse = IJournal