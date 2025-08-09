'use client'

import { useCallback, useMemo } from 'react'
import { AccountStatus } from '@/libs/constants/account.constant'
import toast from 'react-hot-toast'
import { useAccount } from '@/libs/utils/account'
import { useFollowUser, useUnfollowUser } from '@/hooks/use-account'
import { useSetAtom } from 'jotai/index'
import { DialogLoginAtom } from '@/components/dialogs/dialog-login'
import { Account } from '@/libs/interfaces/account.interface'
import { useRouter } from 'next/navigation'


export const useFollowUnfollow = (account: Omit<Account, 'updatedAt' | 'createdAt'> | null | undefined) => {
    const appRouter = useRouter()
    const { status, me } = useAccount()
    const { mutateAsync: follow, isPending: isFollowPending } = useFollowUser(account?._id ?? '')
    const { mutateAsync: unfollow, isPending: isUnfollowPending } = useUnfollowUser(account?._id ?? '')
    const setLoginDialogOpen = useSetAtom(DialogLoginAtom)
    
    const isFollowingUnfollowingPending = useMemo(() => isFollowPending || isUnfollowPending, [isFollowPending, isUnfollowPending])
    
    const handleFollowUnfollow = useCallback(async () => {
        if (status === AccountStatus.guest) {
            setLoginDialogOpen((prev) => (
                { ...prev, open: true }
            ))
            return
        }
        if (isFollowingUnfollowingPending || !account) return
        if (me?.followingUids?.includes(account._id)) {
            try {
                const res = await unfollow()
                if (res) {
                    appRouter.refresh()
                    toast.success(`Successfully unfollowed ${account.name}`)
                } else {
                    toast.error(`Failed to unfollow ${account.name}`)
                }
            } catch {
                toast.error(`Failed to unfollow ${account.name}`)
            }
        } else {
            try {
                const res = await follow()
                if (res) {
                    appRouter.refresh()
                    toast.success(`Successfully followed ${account.name}`)
                } else {
                    toast.error(`Failed to follow ${account.name}`)
                }
            } catch {
                toast.error(`Failed to follow ${account.name}`)
            }
        }
    }, [account, appRouter, follow, isFollowingUnfollowingPending, me?.followingUids, setLoginDialogOpen, status, unfollow])
    
    return {
        handleFollowUnfollow,
        isFollowingUnfollowingPending
    }
}