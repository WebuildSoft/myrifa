"use client"

import { ImageSlider } from "@/components/rifa/ImageSlider"

interface CampaignHeroProps {
    images: string[]
    title: string
}

export function CampaignHero({ images, title }: CampaignHeroProps) {
    return (
        <div className="relative w-full h-[300px] md:h-[420px] bg-black overflow-hidden underline-offset-4">
            <ImageSlider images={images} title={title} />
            {/* Overlay gradient - only decorative on desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none hidden md:block" />
        </div>
    )
}
