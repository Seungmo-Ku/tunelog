'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import { Button } from '@/components/buttons'
import React, { useCallback, useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { isEmpty } from 'lodash'
import { useHandleRegister } from '@/hooks/use-account'
import toast from 'react-hot-toast'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'


export interface DialogRegisterProps {
    open: boolean
}

export const DialogRegisterAtom = atom<DialogRegisterProps>({
    open: false
})

export const DialogRegister = () => {
    const { mutateAsync, isPending } = useHandleRegister()
    const [dialogLogin, setDialogLogin] = useAtom(DialogRegisterAtom)
    const { open } = dialogLogin
    const [userid, setUserid] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName] = useState<string>('')
    const { status } = useAccount()
    
    const onClose = useCallback(() => {
        setDialogLogin((prev) => (
            { ...prev, open: false }
        ))
        setUserid('')
        setPassword('')
        setName('')
    }, [setDialogLogin])
    
    useEffect(() => {
        if (status !== AccountStatus.guest) {
            onClose()
        }
    }, [onClose, status])
    
    const handleLogin = useCallback(async () => {
        if (isEmpty(userid) || isEmpty(password) || isPending) return
        try {
            const response = await mutateAsync({ userid, password, name })
            if (response.status === 201) {
                toast.success(response.message)
                onClose()
            } else {
                toast.error(response.message)
            }
        } catch {
            toast.error('Register failed, please try again')
        }
    }, [isPending, mutateAsync, name, onClose, password, userid])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Register Account</DialogTitle>
                    <Input
                        type='text'
                        placeholder='User ID'
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                    />
                    <Input
                        type='text'
                        placeholder='Nickname'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button.Box
                        text='Register'
                        onClick={handleLogin}
                        disabled={isEmpty(userid) || isEmpty(password) || isEmpty(name) || isPending}
                    />
                </DialogPanel>
            </div>
        </Dialog>
    )
}