import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'
import { RifaStatus } from '@prisma/client'

export const runtime = 'edge'
// Cache the image for 1 hour to prevent server overload on viral shares
export const revalidate = 3600

export const alt = 'Campanha Oficial MyRifa'
export const size = {
    width: 1200,
    height: 630,
}

export default async function Image({ params }: { params: { slug: string } }) {
    try {
        const { slug } = params
        const rifa = await prisma.rifa.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: { numbers: { where: { status: 'PAID' } } }
                },
                user: { select: { name: true } }
            }
        })

        if (!rifa || rifa.isPrivate || rifa.status === RifaStatus.CANCELLED || rifa.status === RifaStatus.DELETED) {
            return new ImageResponse(
                (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            fontSize: 48,
                            fontWeight: 900,
                        }}
                    >
                        Campanha Indisponível
                    </div>
                ),
                { ...size }
            )
        }

        const paidNumbers = rifa._count.numbers
        const progress = Math.round((paidNumbers / rifa.totalNumbers) * 100)

        let statusBadge = null;
        if (rifa.status === RifaStatus.DRAWN) {
            statusBadge = (
                <div style={{ display: 'flex', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: 9999, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                    🎉 Sorteio Realizado
                </div>
            )
        } else if (progress >= 90) {
            statusBadge = (
                <div style={{ display: 'flex', background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: 9999, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                    🔥 Últimas Cotas!
                </div>
            )
        } else if (progress > 0) {
            statusBadge = (
                <div style={{ display: 'flex', background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: 9999, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                    ⚡ {progress}% Vendido
                </div>
            )
        } else {
            statusBadge = (
                <div style={{ display: 'flex', background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: 9999, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
                    🎯 Participe Agora
                </div>
            )
        }

        const formattedPrice = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(rifa.numberPrice))

        const imageUrl = rifa.coverImage || (rifa.images && rifa.images.length > 0 ? rifa.images[0] : null)

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#0f172a',
                        position: 'relative',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Background Image with Overlay */}
                    {imageUrl ? (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
                            <img
                                src={imageUrl}
                                alt="Background"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {/* Dark Gradient Overlay */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 10%, rgba(15, 23, 42, 0.4) 100%)' }} />
                        </div>
                    ) : (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)' }} />
                    )}

                    {/* Content Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '60px 80px', position: 'relative', zIndex: 10 }}>

                        {/* Top: Status Badge and Organizer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                            {statusBadge}

                            {rifa.user?.name && (
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '12px 24px', borderRadius: 9999 }}>
                                    <span style={{ color: 'white', fontSize: 24, fontWeight: 600 }}>por {rifa.user.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Bottom: Title & Price */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'flex', color: '#60a5fa', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3 }}>
                                Campanha Oficial MyRifa
                            </div>
                            <h1 style={{ color: 'white', fontSize: 72, fontWeight: 900, lineHeight: 1.1, margin: 0, textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                                {rifa.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 20 }}>
                                <span style={{ color: 'white', fontSize: 32, fontWeight: 500, opacity: 0.8, paddingBottom: 8 }}>Apenas</span>
                                <span style={{ color: '#10b981', fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{formattedPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            { ...size }
        )
    } catch (e: any) {
        console.error('OG Image Generation Error:', e)
        return new Response('Failed to generate image', { status: 500 })
    }
}
