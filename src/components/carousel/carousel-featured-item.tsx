'use client'

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from '@/hooks/use-carousel-autoplay'
import { Recommended } from '@/libs/interfaces/recommended.interface'
import { FeaturedItemsContainer } from '@/components/carousel/featured-items-container'


interface CarouselProps {
    slides: Recommended[] | undefined | null
    options?: EmblaOptionsType
}

export const Carousel = ({ slides, options }: CarouselProps) => {
    
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 3000 })
    ])
    
    const { pauseOrResume } = useAutoplay(emblaApi)
    
    if (slides === undefined || slides === null) {
        return
    }
    
    return (
        <div className='embla__viewport h-full rounded-[40px]' ref={emblaRef} onMouseEnter={pauseOrResume} onMouseLeave={pauseOrResume}>
            <div className='embla__container h-full flex'>
                {slides.map((recommended, index) => (
                    <div className='embla__slide h-full flex-[0_0_100%] translate-z-0' key={index}>
                        <FeaturedItemsContainer slide={recommended}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
