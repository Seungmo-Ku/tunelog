'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Button } from '@/components/buttons'
import React, { useCallback, useMemo } from 'react'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

export interface DialogSettingsProps {
    open: boolean
}

export const DialogSettingsAtom = atom<DialogSettingsProps>({
    open: false
})

export const DialogSettings = () => {
    const { i18n } = useTranslation()
    const [dialogSettings, setDialogSettings] = useAtom(DialogSettingsAtom)
    const { open } = dialogSettings
    
    const currentLanguage = useMemo(() => {
        switch (i18n.language) {
            case 'ko':
                return '한국어'
            case 'ja':
                return '日本語'
            default:
                return 'English'
        }
    }, [i18n.language])
    
    const onClose = useCallback(() => {
        setDialogSettings((prev) => (
            { ...prev, open: false }
        ))
    }, [setDialogSettings])
    
    return (
        <Dialog transition open={open} onClose={onClose} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 space-y-4 bg-[#33373B] text-white md:p-12 p-4 rounded-2xl flex flex-col'>
                    <DialogTitle className='font-bold'>Settings</DialogTitle>
                    <div className='flex flex-col gap-y-2 text-white'>
                        <p>{`Current Language: ${currentLanguage}`}</p>
                        <div className='grid grid-cols-3 gap-2'>
                            <Button.Box
                                text='English'
                                onClick={() => {
                                    i18n.changeLanguage('en')
                                    localStorage.setItem('appLanguage', 'en')
                                }}
                            />
                            <Button.Box
                                text='한국어'
                                onClick={() => {
                                    i18n.changeLanguage('ko')
                                    localStorage.setItem('appLanguage', 'ko')
                                }}
                            />
                            <Button.Box
                                text='日本語'
                                onClick={() => {
                                    i18n.changeLanguage('ja')
                                    localStorage.setItem('appLanguage', 'ja')
                                }}
                            />
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}