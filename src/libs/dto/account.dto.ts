import { IAccount, IObjectCount } from '@/libs/interfaces/account.interface'


export type AccountRegisterDto = Pick<IAccount, 'name' | 'userid'> & { password: string }

export type AccountLoginDto = Pick<IAccount, 'userid'> & { password: string }

export type AccountResponse = IAccount

export type ObjectCountResponse = IObjectCount