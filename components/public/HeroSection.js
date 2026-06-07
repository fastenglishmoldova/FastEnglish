'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HERO_IMAGES = [
  {
    src: '/390cf0b4-33db-44f7-b780-d8da1d74f038.png',
    alt: 'Fast English - Cursuri de engleză',
  },
  {
    src: '/29236329-ddb2-496c-af07-c70e446df044.png',
    alt: 'Fast English - Elevi la cursuri',
  },
]

const MOBILE_IMG = '/bf6d05c3-e4e2-45ee-9aac-840f2090d586.png'

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Detect mobile via matchMedia (robust — not dependent on CSS class toggling)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [isMobile])

  const goTo = (index) => setCurrentImage(index)

  /* ─── Shared text content (identical copy on both layouts) ─── */
  const TextBlock = (
    <div className={`max-w-lg transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Tagline */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-[#C8102E] font-bold text-[11px] tracking-[0.3em] uppercase">LEARN</span>
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="text-gray-500 font-bold text-[11px] tracking-[0.3em] uppercase">GROW</span>
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="text-gray-500 font-bold text-[11px] tracking-[0.3em] uppercase">SUCCEED</span>
      </div>

      {/* Heading */}
      <h1
        className="fe-hero-title font-black leading-[1.06] mb-5"
        style={{
          backgroundImage: 'linear-gradient(120deg, #012169 0%, #1e3a8a 45%, #C8102E 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        <span className="block text-4xl sm:text-5xl lg:text-6xl">Învață Engleza.</span>
        <span className="block text-4xl sm:text-5xl lg:text-6xl">Deschide-ți Lumea.</span>
        <span className="block text-4xl sm:text-5xl lg:text-6xl">Modelează-ți Viitorul.</span>
      </h1>

      {/* Accent line */}
      <div className="w-14 h-[3px] rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #012169, #C8102E)' }} />

      {/* Subtitle */}
      <p className="fe-hero-sub text-gray-600 text-base sm:text-lg leading-relaxed mb-8 font-light">
        Lecții interactive, comunicare reală și o comunitate prietenoasă ca să vorbești engleza cu încredere.
      </p>

      {/* CTA Buttons */}
      <div className="fe-hero-btns flex flex-col xs:flex-row gap-3 mb-8">
        <Link
          href="#cursuri"
          className="fe-hero-btn px-7 py-3.5 bg-[#C8102E] hover:bg-[#9E0A23] text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-900/40 hover:scale-105 active:scale-95 text-center"
        >
          Cursurile Noastre
        </Link>
        <Link
          href="/inscriere"
          className="fe-hero-btn px-7 py-3.5 bg-transparent border-2 border-[#1a1a2e] hover:bg-[#1a1a2e] text-[#1a1a2e] hover:text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 active:scale-95 text-center"
        >
          Înscrie-te Acum
        </Link>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-[#C8102E]/30 flex items-center justify-center bg-[#C8102E]/10">
          <svg className="w-4 h-4 text-[#C8102E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="text-[#1a1a2e] text-sm font-semibold">De încredere pentru elevi și părinți</p>
          <p className="text-gray-500 text-xs">Alătură-te comunității noastre de engleză!</p>
        </div>
      </div>
    </div>
  )

  /* ═══════════════ MOBILE LAYOUT (doar imaginea bf6d05c3) ═══════════════ */
  if (mounted && isMobile) {
    return (
      <section
        style={{
          position: 'relative',
          minHeight: '92svh',
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
          background: '#FFFBF5',
        }}
      >
        {/* ONLY the image the user provided */}
        <Image
          src={MOBILE_IMG}
          alt="Fast English - Școală de engleză"
          fill
          priority
          quality={100}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 35%', zIndex: 0 }}
        />

        {/* Cream gradient: solid on top (text area), fades to reveal image bottom-half */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background:
              'linear-gradient(to bottom, #FFFBF5 0%, #FFFBF5 38%, rgba(255,251,245,0.94) 50%, rgba(255,251,245,0.5) 62%, rgba(255,251,245,0) 78%)',
          }}
        />

        {/* Subtle red glow accent top-right */}
        <div
          style={{
            position: 'absolute', top: -60, right: -60, width: 200, height: 200, zIndex: 1,
            background: 'radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Text in the top half */}
        <div
          className="fe-hero-text-mobile"
          style={{
            position: 'relative', zIndex: 2, width: '100%',
            padding: '34px 24px 0',
            paddingTop: 'max(34px, env(safe-area-inset-top))',
          }}
        >
          {TextBlock}
        </div>

        <style jsx>{`
          /* Tagline */
          .fe-hero-text-mobile :global(.flex.items-center.gap-2.mb-5) {
            margin-bottom: 16px !important;
          }
          /* Title */
          .fe-hero-text-mobile :global(.fe-hero-title) span {
            font-size: 28px !important;
            line-height: 1.12 !important;
          }
          .fe-hero-text-mobile :global(.fe-hero-title) {
            margin-bottom: 16px !important;
          }
          /* Accent line */
          .fe-hero-text-mobile :global(.w-14) {
            margin-bottom: 18px !important;
          }
          /* Subtitle */
          .fe-hero-text-mobile :global(.fe-hero-sub) {
            font-size: 14px !important;
            line-height: 1.6 !important;
            margin-bottom: 24px !important;
            max-width: 100% !important;
          }
          /* Buttons — side by side, compact */
          .fe-hero-text-mobile :global(.fe-hero-btns) {
            flex-direction: row !important;
            gap: 10px !important;
            margin-bottom: 24px !important;
          }
          .fe-hero-text-mobile :global(.fe-hero-btn) {
            flex: 1 1 0 !important;
            padding: 11px 12px !important;
            font-size: 11px !important;
            letter-spacing: 0.06em !important;
            border-radius: 10px !important;
            box-sizing: border-box !important;
            white-space: nowrap !important;
          }
          /* Primary button gets a lifted shadow */
          .fe-hero-text-mobile :global(.fe-hero-btn:first-child) {
            box-shadow: 0 8px 20px rgba(200,16,46,0.28) !important;
          }
          /* Trust badge — compact */
          .fe-hero-text-mobile :global(.flex.items-center.gap-3) {
            gap: 10px !important;
          }
          .fe-hero-text-mobile :global(.flex.items-center.gap-3 > div:first-child) {
            width: 34px !important;
            height: 34px !important;
          }
          .fe-hero-text-mobile :global(.flex.items-center.gap-3 p:first-child) {
            font-size: 13px !important;
          }
          .fe-hero-text-mobile :global(.flex.items-center.gap-3 p:last-child) {
            font-size: 11.5px !important;
          }
        `}</style>
      </section>
    )
  }

  /* ═══════════════ DESKTOP LAYOUT (slideshow neschimbat) ═══════════════ */
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Background crossfade slideshow ── */}
      {HERO_IMAGES.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={i === 0}
          quality={100}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: i === currentImage ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Text ── */}
      <div className="relative w-full px-6 sm:px-10 lg:px-16 py-28" style={{ zIndex: 2 }}>
        {TextBlock}
      </div>

      {/* ── Slideshow dots ── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 2 }}>
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Imagine ${index + 1}`}
            className="p-1"
          >
            <span
              className="block h-[3px] rounded-full transition-all duration-500 bg-white"
              style={{
                width: index === currentImage ? '24px' : '8px',
                opacity: index === currentImage ? 1 : 0.4,
              }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
