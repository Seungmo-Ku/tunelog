'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import { Button } from '@/components/buttons'
import React, { useCallback, useEffect, useState } from 'react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { isEmpty } from 'lodash'
import { useHandleLogin } from '@/hooks/use-account'
import toast from 'react-hot-toast'
import { useAccount } from '@/libs/utils/account'
import { AccountStatus } from '@/libs/constants/account.constant'
import { DialogRegisterAtom } from '@/components/dialogs/dialog-register'


export interface DialogLoginProps {
    open: boolean
}

export const DialogLoginAtom = atom<DialogLoginProps>({
    open: false
})

export const DialogLogin = () => {
    const { mutateAsync, isPending } = useHandleLogin()
    const [dialogLogin, setDialogLogin] = useAtom(DialogLoginAtom)
    const setDialogRegister = useSetAtom(DialogRegisterAtom)
    const { open } = dialogLogin
    const [userid, setUserid] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { status } = useAccount()
    
    const onClose = useCallback(() => {
        setDialogLogin((prev) => (
            { ...prev, open: false }
        ))
        setUserid('')
        setPassword('')
    }, [setDialogLogin])
    
    useEffect(() => {
        if (status !== AccountStatus.guest) {
            onClose()
        }
    }, [onClose, status])
    
    const handleLogin = useCallback(async () => {
        if (isEmpty(userid) || isEmpty(password) || isPending) return
        try {
            const response = await mutateAsync({ userid, password })
            if (response.status === 200) {
                toast.success('Login successful')
                onClose()
            } else {
                toast.error(response.message || 'Login failed')
            }
        } catch {
            toast.error('Invalid userid or password')
        }
    }, [isPending, mutateAsync, onClose, password, userid])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Login</DialogTitle>
                    <Input
                        type='text'
                        placeholder='User ID'
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                    />
                    <Input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className='w-full grid grid-cols-2 gap-x-2'>
                        <Button.Box
                            text='Register Account'
                            onClick={() => {
                                onClose()
                                setDialogRegister((prev) => ({
                                    ...prev,
                                    open: true
                                }))
                            }}
                        />
                        <Button.Box
                            text='Login'
                            onClick={handleLogin}
                            disabled={isEmpty(userid) || isEmpty(password) || isPending}
                        />
                    </div>
                
                </DialogPanel>
            </div>
        </Dialog>
    )
}