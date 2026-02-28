import { HomeNav } from "@/components/home/HomeNav"
import { HomeHero } from "@/components/home/HomeHero"
import { HomeFeatures } from "@/components/home/HomeFeatures"
import { HomeCTA } from "@/components/home/HomeCTA"
import { HomeFooter } from "@/components/home/HomeFooter"
import { PricingSection } from "@/components/PricingSection"

export default function Home() {
    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0f0a19] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
            <HomeNav />
            <main>
                <HomeHero />
                <HomeFeatures />
                <PricingSection />
                <HomeCTA />
            </main>
            <HomeFooter />
        </div>
    )
}
