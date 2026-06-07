'use client'

import { useState, useEffect, useRef } from 'react'

/* ─── Icons ─────────────────────────────────────────────────── */
const StarFilled = ({ size = 14, color = '#F59E0B' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const QuoteIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
    <path d="M0 22V13.2C0 9.73333 0.9 6.8 2.7 4.4C4.5 2 7.03333 0.466667 10.3 0L11.6 2.2C9.46667 2.6 7.76667 3.53333 6.5 5C5.3 6.4 4.63333 8.06667 4.5 10H9V22H0ZM17 22V13.2C17 9.73333 17.9 6.8 19.7 4.4C21.5 2 24.0333 0.466667 27.3 0L28.6 2.2C26.4667 2.6 24.7667 3.53333 23.5 5C22.3 6.4 21.6333 8.06667 21.5 10H26V22H17Z" fill="#C8102E" fillOpacity="0.15"/>
  </svg>
)

const UKFlag = () => (
  <svg width="22" height="16" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="40" fill="#012169"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
    <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5"/>
    <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12"/>
    <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7"/>
  </svg>
)

const IcoArrowL = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
  </svg>
)
const IcoArrowR = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
  </svg>
)

const IcoTeachers = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IcoBook = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
  </svg>
)
const IcoTarget = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IcoGlobe = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
)
const IcoHeart = () => (
  <svg width="22" height="22" fill="#C8102E" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
)

/* ─── Data ───────────────────────────────────────────────────── */
const RATING_BARS = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6  },
  { stars: 3, pct: 1  },
  { stars: 2, pct: 1  },
  { stars: 1, pct: 0  },
]

const STATIC_REVIEWS = [
  {
    id: 1,
    name: 'Maria Popescu',
    role: 'Părinte',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Profesori dedicați, atmosferă prietenoasă și rezultate excelente. Fiica mea a început să vorbească engleza cu multă încredere!',
  },
  {
    id: 2,
    name: 'Andrei Ionescu',
    role: 'Cursant',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Lecțiile sunt interactive și distractive. Am învățat mai mult în câteva luni decât în toți anii de școală. Recomand cu drag!',
  },
  {
    id: 3,
    name: 'Elena Radu',
    role: 'Cursantă',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Îmi place că vorbim mult în engleză și că avem activități practice. M-a ajutat enorm să-mi depășesc emoțiile!',
  },
  {
    id: 4,
    name: 'Daniel Stan',
    role: 'Părinte',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'O comunitate minunată și profesori care chiar se implică. Copilul meu merge cu plăcere la fiecare curs.',
  },
  {
    id: 5,
    name: 'Ioana Munteanu',
    role: 'Cursantă',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Am trecut de la "nu știu nimic" la conversații reale în engleză. Metoda Fast English chiar funcționează!',
  },
  {
    id: 6,
    name: 'Bogdan Florescu',
    role: 'Cursant',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Cel mai bun investiție! Nivelul meu de engleză s-a îmbunătățit vizibil, iar profesorii sunt foarte motivați.',
  },
  {
    id: 7,
    name: 'Cristina Vlad',
    role: 'Părinte',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Atmosfera caldă și lecțiile bine structurate fac toată diferența. Băiatul meu abia așteaptă fiecare oră de curs.',
  },
  {
    id: 8,
    name: 'Mihai Dumitrescu',
    role: 'Cursant',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&q=80',
    rating: 5,
    text: 'Am pregătit examenul Cambridge FCE cu Fast English și l-am luat cu nota B. Mulțumesc echipei!',
  },
]

const TRUST = [
  { icon: <IcoTeachers />, color: '#C8102E', label: 'Profesori calificați',   desc: 'Echipă cu experiență și pasiune pentru predare' },
  { icon: <IcoBook />,     color: '#012169', label: 'Metode eficiente',        desc: 'Lecții interactive și materiale moderne' },
  { icon: <IcoTarget />,   color: '#C8102E', label: 'Rezultate vizibile',      desc: 'Progres rapid și încredere în comunicare' },
  { icon: <IcoGlobe />,    color: '#012169', label: 'Comunitate suportivă',    desc: 'Învățăm și creștem împreună' },
]

const PER_PAGE = 4

/* ─── Component ─────────────────────────────────────────────── */
export default function ReviewsSection() {
  const [apiReviews, setApiReviews]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(0)
  const [visible, setVisible]         = useState(false)
  const [hovered, setHovered]         = useState(null)
  const [barsAnim, setBarsAnim]       = useState(false)
  const [trustCols, setTrustCols]     = useState(4)
  const sectionRef = useRef(null)
  const barsRef    = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const update = () => setTrustCols(mq.matches ? 1 : 4)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  /* fetch reviews */
  useEffect(() => {
    fetch('/api/public/reviews')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setApiReviews(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  /* intersection */
  useEffect(() => {
    const io  = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    const io2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setBarsAnim(true) }, { threshold: 0.3 })
    if (sectionRef.current) io.observe(sectionRef.current)
    if (barsRef.current)    io2.observe(barsRef.current)
    return () => { io.disconnect(); io2.disconnect() }
  }, [])

  const reviews  = loading ? STATIC_REVIEWS : (apiReviews.length >= 4 ? apiReviews : STATIC_REVIEWS)
  const pages    = Math.ceil(reviews.length / PER_PAGE)
  const slice    = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const prev = () => setPage(p => (p - 1 + pages) % pages)
  const next = () => setPage(p => (p + 1) % pages)

  /* map API review shape to display shape */
  const norm = (r, i) => ({
    id:     r.id   || i,
    name:   r.authorName || r.name || 'Anonim',
    role:   r.roleLabel  || r.role || 'Cursant',
    avatar: r.avatarUrl  || STATIC_REVIEWS[i % STATIC_REVIEWS.length]?.avatar || '',
    rating: r.rating || 5,
    text:   r.message || r.text || '',
  })

  const displaySlice = slice.map(norm)

  return (
    <section
      id="recenzii"
      ref={sectionRef}
      style={{ background: '#FFFBF5', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Decorative background Big Ben outline ── */}
      <div style={{
        position: 'absolute', left: -30, top: 20, zIndex: 0,
        opacity: 0.045, pointerEvents: 'none',
      }}>
        <svg width="180" height="320" viewBox="0 0 180 320" fill="none" stroke="#012169" strokeWidth="1.5">
          {/* simplified Big Ben silhouette */}
          <rect x="60" y="200" width="60" height="120" rx="2"/>
          <rect x="70" y="170" width="40" height="32" rx="1"/>
          <rect x="75" y="140" width="30" height="32" rx="1"/>
          <rect x="78" y="110" width="24" height="32" rx="1"/>
          <rect x="76" y="80"  width="28" height="32" rx="1"/>
          <rect x="72" y="50"  width="36" height="32" rx="2"/>
          <polygon points="90,10 68,50 112,50"/>
          <circle cx="90" cy="86" r="14"/>
          <line x1="90" y1="72" x2="90" y2="100"/>
          <line x1="76" y1="86" x2="104" y2="86"/>
        </svg>
      </div>

      {/* Dot grid top-right */}
      <div style={{
        position: 'absolute', right: 24, top: 40, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, #C8102E26 1.5px, transparent 1.5px)',
        backgroundSize: '16px 16px',
        width: 120, height: 100, opacity: 0.7,
        pointerEvents: 'none',
      }} />

      <div className="reviews-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '88px 64px 0', position: 'relative', zIndex: 1 }}>

        {/* ══ HEADER ══ */}
        <div className="reviews-header" style={{
          textAlign: 'center', marginBottom: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8102E' }}>
              Recenzii
            </span>
            <div style={{ width: 36, height: 2.5, background: '#C8102E', borderRadius: 99 }} />
          </div>

          <h2 className="reviews-heading" style={{
            margin: '0 0 18px',
            fontSize: 'clamp(30px, 4vw, 52px)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
            color: '#1a1a2e',
          }}>
            Părerea <span style={{
              background: 'linear-gradient(120deg, #012169 0%, #1e3a8a 45%, #C8102E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>cursanților</span> noștri
          </h2>

          <p style={{ fontSize: 16.5, color: '#6B7280', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Mii de cursanți și părinți au încredere în Fast English pentru
            rezultate reale și o experiență modernă de învățare.
          </p>
        </div>

        {/* ══ RATING SUMMARY CARD ══ */}
        <div
          ref={barsRef}
          style={{
            background: '#ffffff',
            border: '1.5px solid #E8E0D5',
            borderRadius: 24,
            padding: '32px 40px',
            maxWidth: 780,
            margin: '0 auto 64px',
            display: 'grid',
            gap: 40,
            alignItems: 'center',
            boxShadow: '0 8px 40px rgba(1,33,105,0.07)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s',
          }}
          className="rating-card"
        >
          {/* Big score */}
          <div className="rc-score" style={{ textAlign: 'center' }}>
            <div className="rating-score" style={{ fontSize: 64, fontWeight: 900, color: '#1a1a2e', lineHeight: 1, letterSpacing: '-0.04em' }}>
              4.9
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '10px 0 8px' }}>
              {[1,2,3,4,5].map(i => <StarFilled key={i} size={18} color="#F59E0B" />)}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
              din 5 bazat pe 250+ recenzii
            </div>
          </div>

          {/* Rating bars */}
          <div className="rc-bars" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RATING_BARS.map(({ stars, pct }) => (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#6B7280', width: 44, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {stars} {stars === 1 ? 'stea' : 'stele'}
                </span>
                <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: stars === 5 ? '#C8102E' : '#E5E7EB',
                    borderRadius: 99,
                    width: barsAnim ? `${pct}%` : '0%',
                    transition: `width 1s ease ${(5 - stars) * 0.08}s`,
                  }} />
                </div>
                <span style={{ fontSize: 13, color: '#6B7280', width: 30, textAlign: 'right', flexShrink: 0 }}>
                  {pct}%
                </span>
              </div>
            ))}
          </div>

          {/* Recommend badge */}
          <div className="rc-badge" style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(200,16,46,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <IcoHeart />
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Recomandat de</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#C8102E' }}>98%</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>dintre cursanți</div>
          </div>
        </div>

        {/* ══ CAROUSEL ══ */}
        <div style={{
          position: 'relative',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
        }}>
          {/* Arrow Left */}
          <button
            onClick={prev}
            className="side-arrow"
            style={{
              position: 'absolute', left: -52, top: '50%', transform: 'translateY(-50%)',
              width: 42, height: 42, borderRadius: '50%',
              background: '#ffffff', border: '1.5px solid #E8E0D5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#374151', zIndex: 5,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E0D5'; e.currentTarget.style.color = '#374151' }}
          >
            <IcoArrowL />
          </button>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gap: 20,
          }} className="reviews-grid">
            {displaySlice.map((r, i) => (
              <ReviewCard
                key={r.id}
                review={r}
                delay={i * 0.07}
                visible={visible}
                hovered={hovered === r.id}
                onHover={() => setHovered(r.id)}
                onLeave={() => setHovered(null)}
              />
            ))}
          </div>

          {/* Arrow Right */}
          <button
            onClick={next}
            className="side-arrow"
            style={{
              position: 'absolute', right: -52, top: '50%', transform: 'translateY(-50%)',
              width: 42, height: 42, borderRadius: '50%',
              background: '#ffffff', border: '1.5px solid #E8E0D5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#374151', zIndex: 5,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8102E'; e.currentTarget.style.color = '#C8102E' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E0D5'; e.currentTarget.style.color = '#374151' }}
          >
            <IcoArrowR />
          </button>
        </div>

        {/* Bottom controls: mobile arrows + dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
          {/* Mobile prev arrow */}
          <button
            onClick={prev}
            className="mobile-nav"
            aria-label="Recenzia anterioară"
            style={{
              display: 'none', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              background: '#ffffff', border: '1.5px solid #E8E0D5',
              cursor: 'pointer', color: '#374151', flexShrink: 0,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <IcoArrowL />
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Pagina ${i + 1}`}
                style={{
                  width: i === page ? 22 : 8, height: 8, borderRadius: 99,
                  background: i === page ? '#C8102E' : '#D1D5DB',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Mobile next arrow */}
          <button
            onClick={next}
            className="mobile-nav"
            aria-label="Recenzia următoare"
            style={{
              display: 'none', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              background: '#ffffff', border: '1.5px solid #E8E0D5',
              cursor: 'pointer', color: '#374151', flexShrink: 0,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <IcoArrowR />
          </button>
        </div>
      </div>

      {/* ══ TRUST BAR ══ */}
      <div className="trust-bar" style={{
        marginTop: 72,
        background: '#ffffff',
        borderTop: '1.5px solid #E8E0D5',
        padding: '44px 64px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: `repeat(${trustCols}, 1fr)`,
          gap: 32, alignItems: 'start',
        }} className="trust-grid">
          {TRUST.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `${t.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.color,
              }}>
                {t.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                  {t.label}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55 }}>
                  {t.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .rating-card  { grid-template-columns: 200px 1fr auto; }
        .reviews-grid { grid-template-columns: repeat(4,1fr); }
        .trust-grid   { grid-template-columns: repeat(4,1fr); }

        /* Tablet */
        @media (max-width: 1024px) {
          .reviews-container { padding: 72px 32px 0 !important; }
          .reviews-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rating-card  {
            grid-template-columns: 1fr !important;
            justify-items: center !important;
            padding: 34px 28px !important;
            gap: 30px !important;
            max-width: 420px !important;
          }
          .rc-bars { width: 100% !important; max-width: 340px !important; }
          .trust-bar    { padding: 44px 32px !important; }
          .side-arrow   { display: none !important; }
          .mobile-nav   { display: inline-flex !important; }
        }

        /* Phone: ONE review per row, rating card stacked & centered */
        @media (max-width: 760px) {
          .reviews-container { padding: 52px 20px 0 !important; }
          .reviews-header    { margin-bottom: 34px !important; }
          .reviews-heading   { font-size: clamp(26px, 7vw, 34px) !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .trust-grid   { grid-template-columns: 1fr !important; gap: 20px !important; }
          .trust-bar    { padding: 38px 22px !important; margin-top: 48px !important; }
          .rating-card  {
            padding: 30px 24px !important;
            gap: 26px !important;
            max-width: 400px !important;
            margin-bottom: 44px !important;
          }
          .rating-score { font-size: 54px !important; }
        }

        /* Small phones */
        @media (max-width: 440px) {
          .reviews-container { padding: 46px 14px 0 !important; }
          .reviews-heading   { font-size: 25px !important; }
          .trust-grid   { grid-template-columns: 1fr !important; gap: 18px !important; }
          .trust-bar    { padding: 32px 18px !important; }
          .rating-card  { padding: 26px 18px !important; gap: 22px !important; }
          .rc-bars { max-width: 100% !important; }
          .rating-score { font-size: 48px !important; }
        }

        /* Extra-small phones (≤ 320px) */
        @media (max-width: 360px) {
          .reviews-container { padding: 42px 12px 0 !important; }
          .reviews-heading   { font-size: 23px !important; }
          .rating-card  { padding: 22px 14px !important; gap: 20px !important; }
          .rating-score { font-size: 44px !important; }
          .trust-bar    { padding: 28px 14px !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── ReviewCard ─────────────────────────────────────────────── */
function ReviewCard({ review, delay, visible, hovered, onHover, onLeave }) {
  return (
    <div
      className="review-card"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        background: '#ffffff',
        border: '1.5px solid #E8E0D5',
        borderRadius: 20,
        padding: '24px 22px 20px',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
        boxShadow: hovered
          ? '0 20px 48px rgba(1,33,105,0.12)'
          : '0 2px 16px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'box-shadow 0.28s ease, transform 0.28s ease, opacity 0.6s ease, margin-top 0.6s ease',
        opacity: visible ? 1 : 0,
        marginTop: visible ? 0 : 20,
        transitionDelay: `${delay}s`,
      }}
    >
      {/* Red top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: hovered ? 'linear-gradient(90deg,#C8102E,#9E0A23)' : 'transparent',
        transition: 'background 0.3s ease',
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Header: avatar + name + stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: '2px solid #E8E0D5',
          background: '#F3F4F6',
        }}>
          {review.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={review.avatar} alt={review.name} width={46} height={46} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#C8102E',
              background: 'rgba(200,16,46,0.08)',
            }}>
              {review.name[0]}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {review.name}
          </div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{review.role}</div>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: review.rating || 5 }).map((_, i) => (
              <StarFilled key={i} size={12} color="#F59E0B" />
            ))}
          </div>
        </div>
      </div>

      {/* Quote icon */}
      <div style={{ marginBottom: 10 }}>
        <QuoteIcon />
      </div>

      {/* Text */}
      <p style={{
        margin: 0, flex: 1,
        fontSize: 13.5, color: '#4B5563', lineHeight: 1.7,
      }}>
        {review.text}
      </p>

      {/* UK flag accent */}
      <div style={{ marginTop: 18 }}>
        <UKFlag />
      </div>

      <style jsx>{`
        @media (max-width: 440px) {
          .review-card { padding: 20px 16px 16px !important; }
        }
        @media (max-width: 360px) {
          .review-card { padding: 18px 14px 14px !important; }
        }
      `}</style>
    </div>
  )
}
