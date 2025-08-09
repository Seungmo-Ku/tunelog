import { useCallback, useEffect, useState } from 'react'
import { EmblaCarouselType } from 'embla-carousel'


type UseAutoplayType = {
    autoplayIsPlaying: boolean
    pauseOrResume: () => void
}

export const useAutoplay = (
    emblaApi: EmblaCarouselType | undefined
): UseAutoplayType => {
    const [autoplayIsPlaying, setAutoplayIsPlaying] = useState(false)
    
    const pauseOrResume = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
        playOrStop()
    }, [emblaApi])
    
    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return
        
        setAutoplayIsPlaying(autoplay.isPlaying())
        emblaApi
            .on('autoplay:play', () => setAutoplayIsPlaying(true))
            .on('autoplay:stop', () => setAutoplayIsPlaying(false))
            .on('reInit', () => setAutoplayIsPlaying(autoplay.isPlaying()))
    }, [emblaApi])
    
    return {
        autoplayIsPlaying,
        pauseOrResume
    }
}
