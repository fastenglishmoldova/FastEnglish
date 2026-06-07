'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

/* ─── SVG Icons ─────────────────────────────────────────────── */
function IconTeacher() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function IconBook() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  )
}
function IconTarget() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}
function IconGrad()   {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
    </svg>
  )
}
function IconUsers()  {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function IconTrophy() {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 010-5H6"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 22h16M12 17v5M8 13.5V9M16 13.5V9M6 9a6 6 0 0012 0V4H6v5z"/>
    </svg>
  )
}
function IconGlobe()  {
  return (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  )
}
function IconArrow()  {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
    </svg>
  )
}
function IconHeart()  {
  return (
    <svg width="22" height="22" fill="#C8102E" stroke="#C8102E" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  )
}

/* ─── Data ───────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <IconTeacher />,
    title: 'Profesori pasionați',
    desc: 'Echipă dedicată, cu experiență și drag pentru predare.',
  },
  {
    icon: <IconBook />,
    title: 'Metode moderne',
    desc: 'Lecții interactive, materiale actualizate și tehnici eficiente.',
  },
  {
    icon: <IconTarget />,
    title: 'Rezultate reale',
    desc: 'Progres vizibil și încredere în comunicarea de zi cu zi.',
  },
]

const STATS = [
  { icon: <IconGrad />,   value: '8+',   label: 'Ani de experiență',  sub: 'În educația de limba engleză' },
  { icon: <IconUsers />,  value: '500+', label: 'Cursanți fericiți',  sub: 'Copii, adolescenți și adulți' },
  { icon: <IconTrophy />, value: '98%',  label: 'Rată de succes',     sub: 'Progres vizibil al cursanților' },
  { icon: <IconGlobe />,  value: '15+',  label: 'Țări',               sub: 'Din care provin cursanții noștri' },
]

/* ─── Blob clip-path (CSS) ───────────────────────────────────── */
const BLOB_CLIP = `polygon(
  30% 0%, 70% 2%, 95% 15%, 100% 45%,
  90% 75%, 70% 95%, 35% 100%, 8% 88%,
  0% 60%, 5% 25%
)`

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const numericTarget = parseInt(target.replace(/\D/g, ''), 10)

  useEffect(() => {
    let start = 0
    const duration = 1400
    const step = Math.ceil(numericTarget / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [numericTarget])

  return <>{count}{suffix}</>
}

/* ─── Main component ─────────────────────────────────────────── */
export default function AboutSection() {
  const [visible, setVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [statCols, setStatCols] = useState(4)
  const [aboutCols, setAboutCols] = useState(2)
  const sectionRef = useRef(null)
  const statsRef   = useRef(null)

  /* Responsive columns (bulletproof, no CSS media-query dependency) */
  useEffect(() => {
    const phone  = window.matchMedia('(max-width: 600px)')
    const tablet = window.matchMedia('(max-width: 900px)')
    const update = () => {
      setStatCols(phone.matches ? 1 : tablet.matches ? 2 : 4)
      setAboutCols(tablet.matches ? 1 : 2)
    }
    update()
    phone.addEventListener('change', update)
    tablet.addEventListener('change', update)
    return () => {
      phone.removeEventListener('change', update)
      tablet.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    const io2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.15 })
    if (sectionRef.current) io.observe(sectionRef.current)
    if (statsRef.current)   io2.observe(statsRef.current)
    return () => { io.disconnect(); io2.disconnect() }
  }, [])

  return (
    <section id="despre" style={{ background: '#FFFBF5', overflow: 'hidden', position: 'relative' }}>

      {/* ══════════ MAIN ROW ══════════ */}
      <div
        ref={sectionRef}
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '96px 64px 80px',
          display: 'grid',
          gridTemplateColumns: aboutCols === 1 ? '1fr' : '1fr 1fr',
          gap: aboutCols === 1 ? 44 : 64,
          alignItems: 'center',
        }}
        className="about-grid"
      >

        {/* ── LEFT: Content ── */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.75s ease, transform 0.75s ease',
        }}>

          {/* Label badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 24,
          }}>
            <div style={{ width: 32, height: 2.5, background: '#C8102E', borderRadius: 99 }} />
            <span style={{
              fontSize: 12, fontWeight: 800, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#C8102E',
            }}>
              Despre Noi
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            margin: '0 0 24px',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.13,
            letterSpacing: '-0.025em',
            color: '#1a1a2e',
          }}>
            Mai mult decât o școală de engleză,{' '}
            <span style={{
              background: 'linear-gradient(120deg, #012169 0%, #1e3a8a 45%, #C8102E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>o comunitate care inspiră.</span>
          </h2>

          {/* Subtitle */}
          <p style={{
            margin: '0 0 40px',
            fontSize: 16.5,
            color: '#6B7280',
            lineHeight: 1.75,
            maxWidth: 480,
          }}>
            La Fast English, credem că fiecare persoană poate vorbi engleza cu
            încredere. Misiunea noastră este să oferim lecții interactive, într-un
            mediu prietenos, unde învățarea devine plăcere.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 44 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `opacity 0.6s ease ${0.15 + i * 0.12}s, transform 0.6s ease ${0.15 + i * 0.12}s`,
                }}
              >
                {/* Icon bubble */}
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: 'rgba(200,16,46,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C8102E',
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 3 }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="about-cta"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '13px 30px', borderRadius: 9999,
              background: '#C8102E', color: '#ffffff',
              fontWeight: 700, fontSize: 15,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(200,16,46,0.30)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(200,16,46,0.38)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,16,46,0.30)' }}
          >
            Află mai multe despre noi
            <IconArrow />
          </button>
        </div>

        {/* ── RIGHT: Image composition ── */}
        <div
          className="about-visual"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: aboutCols === 1 ? (statCols === 1 ? 340 : 420) : 'none',
            margin: aboutCols === 1 ? '0 auto' : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.96)',
            transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
          }}
        >

          {/* Decorative dots grid */}
          <div style={{
            position: 'absolute', top: -24, right: -16, width: 120, height: 120,
            backgroundImage: 'radial-gradient(circle, #C8102E22 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', bottom: 20, left: -20, width: 80, height: 80,
            backgroundImage: 'radial-gradient(circle, #01216922 1.5px, transparent 1.5px)',
            backgroundSize: '12px 12px',
            zIndex: 0,
          }} />

          {/* Soft glow behind blob */}
          <div style={{
            position: 'absolute', top: '10%', left: '10%',
            width: '80%', height: '80%',
            background: 'radial-gradient(ellipse, rgba(200,16,46,0.10) 0%, rgba(1,33,105,0.06) 60%, transparent 80%)',
            filter: 'blur(40px)',
            zIndex: 0,
          }} />

          {/* Blob image frame */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            clipPath: BLOB_CLIP,
            borderRadius: 40,
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            width: '100%',
            boxShadow: '0 32px 80px rgba(1,33,105,0.14)',
          }}>
            <Image
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&h=900&fit=crop&q=85"
              alt="Elevi Fast English la curs"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
            />
            {/* Subtle warm overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, rgba(255,220,120,0.06) 0%, rgba(200,16,46,0.04) 100%)',
            }} />
          </div>

          {/* Floating badge — bottom-left of blob */}
          <div
            className="about-badge"
            style={{
            position: 'absolute',
            bottom: '10%', left: '-4%',
            zIndex: 10,
            width: 110, height: 110,
            borderRadius: '50%',
            background: '#012169',
            boxShadow: '0 12px 36px rgba(1,33,105,0.30)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 6,
          }}>
            <IconHeart />
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#ffffff',
              textAlign: 'center', lineHeight: 1.35,
              padding: '0 10px',
            }}>
              Învățăm<br />împreună.<br />Reușim împreună.
            </span>
          </div>

          {/* Small red arc accent */}
          <div style={{
            position: 'absolute', top: '6%', right: '-6%', zIndex: 0,
            width: 70, height: 70,
            borderRadius: '50%',
            border: '3px solid #C8102E33',
          }} />
          <div style={{
            position: 'absolute', top: '12%', right: '-2%', zIndex: 0,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(200,16,46,0.10)',
          }} />
        </div>
      </div>

      {/* ══════════ STATS BAR ══════════ */}
      <div ref={statsRef} style={{ background: '#ffffff', borderTop: '1px solid #E8E0D5', marginTop: 48 }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: `repeat(${statCols}, 1fr)`,
          gap: statCols === 1 ? 14 : 0,
          padding: statCols === 1 ? '40px 20px 44px' : '52px 64px',
        }} className="stats-grid">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-item"
              style={{
                display: 'flex', alignItems: 'center',
                gap: 18,
                justifyContent: statCols === 1 ? 'center' : 'flex-start',
                background: statCols === 1 ? '#FFFBF5' : 'transparent',
                border: statCols === 1 ? '1px solid #E8E0D5' : 'none',
                borderRadius: statCols === 1 ? 16 : 0,
                padding: statCols === 1 ? '20px' : 0,
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              {/* Icon pill */}
              <div className="stat-icon" style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: i % 2 === 0 ? 'rgba(200,16,46,0.08)' : 'rgba(1,33,105,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: i % 2 === 0 ? '#C8102E' : '#012169',
              }}>
                {s.icon}
              </div>

              <div>
                <div className="stat-value" style={{
                  fontSize: 28, fontWeight: 900, lineHeight: 1,
                  color: i % 2 === 0 ? '#C8102E' : '#012169',
                  marginBottom: 4,
                }}>
                  {statsVisible ? <Counter target={s.value} suffix={s.value.replace(/[0-9]/g, '')} /> : '0'}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Responsive styles ── */}
      <style jsx>{`
        .about-grid {
          grid-template-columns: 1fr 1fr;
        }
        .stats-grid {
          grid-template-columns: repeat(4, 1fr);
          padding: 52px 64px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .about-grid {
            gap: 48px !important;
            padding: 76px 32px 60px !important;
          }
          .stats-grid {
            padding: 48px 32px !important;
          }
        }

        /* Stack: image below text */
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 44px !important;
            padding: 64px 24px 52px !important;
          }
          .about-visual {
            max-width: 420px;
            width: 100%;
            margin: 0 auto;
          }
          .stats-grid {
            padding: 44px 32px !important;
            gap: 30px 24px !important;
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .about-grid {
            gap: 40px !important;
            padding: 48px 20px 40px !important;
          }
          .about-cta {
            width: 100% !important;
            justify-content: center !important;
          }
          .about-visual {
            max-width: 340px;
          }
          .about-badge {
            width: 92px !important;
            height: 92px !important;
          }
          .stats-grid {
            padding: 56px 20px 44px !important;
            gap: 14px !important;
          }
        }

        /* Small phones */
        @media (max-width: 380px) {
          .about-visual {
            max-width: 280px;
          }
          .about-badge {
            width: 78px !important;
            height: 78px !important;
          }
          .stats-grid {
            padding: 48px 14px 38px !important;
            gap: 12px !important;
          }
          .stat-icon {
            width: 48px !important;
            height: 48px !important;
          }
          .stat-value {
            font-size: 25px !important;
          }
        }
      `}</style>
    </section>
  )
}
