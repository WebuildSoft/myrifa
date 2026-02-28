"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageSliderProps {
    images: string[]
    title: string
}

export function ImageSlider({ images, title }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    const handlePrev = React.useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }, [images.length])

    const handleNext = React.useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, [images.length])

    // Keyboard support
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev()
            if (e.key === "ArrowRight") handleNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handlePrev, handleNext])

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
        <div className="relative w-full h-full group outline-none" tabIndex={0} aria-label={`Galeria de imagens de ${title}`}>
            <div className="relative w-full h-full overflow-hidden">
                <Image
                    src={images[currentIndex]}
                    alt={`${title} - imagem ${currentIndex + 1} de ${images.length}`}
                    fill
                    className="object-contain md:object-cover object-center transition-all duration-500 ease-in-out"
                    priority
                    sizes="(max-width: 768px) 100vw, 1200px"
                />
            </div>

            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                aria-label="Imagem anterior"
                className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 rounded-full p-2 md:p-3 bg-black/30 text-white hover:bg-black/50 transition-all backdrop-blur-sm z-20 opacity-80 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            >
                <ChevronLeft size={22} />
            </button>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                aria-label="Próxima imagem"
                className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 rounded-full p-2 md:p-3 bg-black/30 text-white hover:bg-black/50 transition-all backdrop-blur-sm z-20 opacity-80 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            >
                <ChevronRight size={22} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Ir para imagem ${idx + 1}`}
                        className={cn(
                            "transition-all duration-300 rounded-full h-2",
                            currentIndex === idx
                                ? "w-6 md:w-8 bg-white"
                                : "w-2 bg-white/50 hover:bg-white/80"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
