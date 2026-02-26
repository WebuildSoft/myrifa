"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"

interface ImageSliderProps {
    images: string[]
    title: string
}

export function ImageSlider({ images, title }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === images.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    if (images.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center">
                <ImageIcon className="w-20 h-20 text-white/20" />
            </div>
        )
    }

    if (images.length === 1) {
        return (
            <Image
                src={images[0]}
                alt={title}
                fill
                className="object-contain md:object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
            />
        )
    }

    return (
        <div className="relative w-full h-full group">
            <Image
                src={images[currentIndex]}
                alt={`${title} - image ${currentIndex + 1}`}
                fill
                className="object-contain md:object-cover object-center transition-all duration-500 ease-in-out"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
            />

            {/* Left Arrow - always visible on mobile, hover on desktop */}
            <div
                onClick={prevSlide}
                className="absolute top-[50%] -translate-y-[50%] left-3 md:left-5 text-2xl rounded-full p-2 md:p-3 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all backdrop-blur-sm z-20 opacity-80 md:opacity-0 md:group-hover:opacity-100"
            >
                <ChevronLeft size={22} />
            </div>

            {/* Right Arrow */}
            <div
                onClick={nextSlide}
                className="absolute top-[50%] -translate-y-[50%] right-3 md:right-5 text-2xl rounded-full p-2 md:p-3 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-all backdrop-blur-sm z-20 opacity-80 md:opacity-0 md:group-hover:opacity-100"
            >
                <ChevronRight size={22} />
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {images.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${currentIndex === slideIndex
                            ? "w-6 md:w-8 h-2 bg-white"
                            : "w-2 h-2 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
