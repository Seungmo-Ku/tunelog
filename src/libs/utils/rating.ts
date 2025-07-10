'use client'

import { SearchType } from '@/libs/constants/spotify.constant'


export const useRatingHash = () => {
    if (typeof window !== 'undefined') {
        
        const hash = window.location.hash.substring(1)
        if (hash) {
            const params = new URLSearchParams(hash)
            const objectId = params.get('initialSelectedObjectId') ?? undefined
            const objectType = params.get('initialSelectedType') as SearchType | null
            
            return {
                objectId,
                objectType
            }
        }
    }
    return {
        objectId: undefined,
        objectType: null
    }
}