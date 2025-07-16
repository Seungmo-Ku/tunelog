export enum AccountStatus {
    user = 'user',
    admin = 'admin',
    guest = 'guest'
}

export type AccountStatusType = AccountStatus.admin | AccountStatus.user | AccountStatus.guest