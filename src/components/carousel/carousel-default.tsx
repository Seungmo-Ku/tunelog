import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useAutoplay } from '@/hooks/use-carousel-autoplay'
import { IRecommended } from '@/libs/interfaces/recommended.interface'
import { FeaturedItemsContainer } from '@/components/carousel/featured-items-container'
import '../carousel.css'


interface CarouselProps {
    slides: IRecommended[] | undefined | null
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
        <div className='embla__viewport h-full' ref={emblaRef} onMouseEnter={pauseOrResume} onMouseLeave={pauseOrResume}>
            <div className='embla__container h-full flex'>
                {slides.map((recommendations, index) => (
                    <div className='embla__slide h-full' key={index}>
                        <FeaturedItemsContainer slide={slides[index]}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
