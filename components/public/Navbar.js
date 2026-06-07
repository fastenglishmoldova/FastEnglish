'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_H = 72 // px – keep in sync with height style below

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [hoveredLink, setHoveredLink] = useState(null)
  const [isMobile, setIsMobile]       = useState(false)
  const [isSmall, setIsSmall]         = useState(false)

  useEffect(() => {
    const mq1 = window.matchMedia('(max-width: 1024px)')
    const mq2 = window.matchMedia('(max-width: 480px)')
    const update = () => { setIsMobile(mq1.matches); setIsSmall(mq2.matches) }
    update()
    mq1.addEventListener('change', update)
    mq2.addEventListener('change', update)
    return () => { mq1.removeEventListener('change', update); mq2.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0)
      const pos = window.scrollY + 100
      for (const id of ['home', 'cursuri', 'despre', 'recenzii', 'faq', 'contact']) {
        const el = document.getElementById(id)
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const links = [
    { id: 'home',     label: 'Acasă'    },
    { id: 'cursuri',  label: 'Cursuri'  },
    { id: 'despre',   label: 'Despre'   },
    { id: 'recenzii', label: 'Recenzii' },
    { id: 'faq',      label: 'FAQ'      },
    { id: 'contact',  label: 'Contact'  },
  ]

  /* ── Shared styles ── */
  const navStyle = {
    position: isScrolled ? 'fixed' : 'relative',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: isScrolled
      ? '0 6px 28px -10px rgba(1,33,105,0.20)'
      : '0 1px 0 0 rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.3s ease',
  }

  return (
    <>
      {/* ── Spacer: reserves space when nav leaves the flow (fixed) ── */}
      {isScrolled && (
        <div aria-hidden="true" style={{ height: NAV_H }} />
      )}

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={navStyle}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box', padding: isSmall ? '0 14px' : isMobile ? '0 20px' : '0 64px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            height: NAV_H,
          }}>

            {/* ── Logo ── */}
            <button
              onClick={() => goTo('home')}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 8px', borderRadius: 12,
              }}
            >
              <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
                <Image
                  src="/FastEnglish-logo.png"
                  alt="Fast English Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <div style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#012169' }}>
                  Fast English
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: '#C8102E',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                }}>
                  Learn English Fast
                </div>
              </div>
            </button>

            {/* ── Desktop Links ── */}
            <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 4 }}>
              {links.map(({ id, label }) => {
                const active = activeSection === id
                const hov    = hoveredLink === id
                return (
                  <button
                    key={id}
                    onClick={() => goTo(id)}
                    onMouseEnter={() => setHoveredLink(id)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      position: 'relative',
                      padding: '10px 20px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 15, fontWeight: 600,
                      color: active || hov ? '#C8102E' : '#4b5563',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                    {/* animated underline */}
                    <span aria-hidden="true" style={{
                      position: 'absolute', bottom: 7, left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'block', height: 2.5, borderRadius: 99,
                      background: '#C8102E',
                      width: active || hov ? '60%' : 0,
                      transition: 'width 0.25s ease',
                    }} />
                  </button>
                )
              })}
            </div>

            {/* ── Right: CTA + Hamburger ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

              {/* CTA – desktop only */}
              <button
                onClick={() => { window.location.href = '/inscriere' }}
                style={{
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center', gap: 8,
                  padding: '11px 28px', borderRadius: 9999,
                  background: 'linear-gradient(135deg, #C8102E 0%, #9E0A23 100%)',
                  color: '#ffffff',
                  fontWeight: 700, fontSize: 15,
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(200,16,46,0.32)',
                }}
              >
                Înscrie-te
                <svg width="15" height="15" fill="none" stroke="#ffffff" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Hamburger – mobile only */}
              <button
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label="Deschide meniu"
                style={{
                  display: isMobile ? 'flex' : 'none',
                  alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44,
                  background: '#f3f4f6', border: '1px solid #e5e7eb',
                  borderRadius: 10, cursor: 'pointer', color: '#374151',
                }}
              >
                <div style={{
                  width: 20, height: 16,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <span style={{
                    display: 'block', height: 2, background: 'currentColor',
                    borderRadius: 99, transformOrigin: 'center',
                    transform: isMobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                    transition: 'transform 0.3s',
                  }} />
                  <span style={{
                    display: 'block', height: 2, background: 'currentColor', borderRadius: 99,
                    opacity: isMobileMenuOpen ? 0 : 1, transition: 'opacity 0.3s',
                  }} />
                  <span style={{
                    display: 'block', height: 2, background: 'currentColor',
                    borderRadius: 99, transformOrigin: 'center',
                    transform: isMobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                    transition: 'transform 0.3s',
                  }} />
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* ══════════════ MOBILE DROPDOWN (deschide în jos) ══════════════ */}
        <div
          style={{
            display: isMobile ? 'block' : 'none',
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#ffffff',
            borderBottom: isMobileMenuOpen ? '1px solid #e5e7eb' : '1px solid transparent',
            boxShadow: isMobileMenuOpen ? '0 18px 34px -14px rgba(1,33,105,0.24)' : 'none',
            overflow: 'hidden',
            maxHeight: isMobileMenuOpen ? 460 : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease, box-shadow 0.3s',
            zIndex: 55,
          }}
        >
          <div style={{ padding: '8px 16px 16px' }}>
            {links.map(({ id, label }) => {
              const active = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '13px 14px', borderRadius: 12, marginBottom: 2,
                    fontSize: 15.5, fontWeight: 600,
                    color: active ? '#C8102E' : '#374151',
                    background: active ? 'rgba(200,16,46,0.07)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {label}
                  <svg
                    width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ opacity: active ? 1 : 0.28 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            })}

            {/* CTA */}
            <Link
              href="/inscriere"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 10, padding: '14px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #C8102E 0%, #9E0A23 100%)',
                color: '#ffffff', fontWeight: 700, fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(200,16,46,0.3)',
              }}
            >
              <span style={{ color: '#ffffff' }}>Înscrie-te acum</span>
              <svg width="18" height="18" fill="none" stroke="#ffffff" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════ BACKDROP (închide la tap în afară) ══════════════ */}
      <div
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          display: isMobile ? 'block' : 'none',
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(15,23,42,0.35)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* ══════════════ Responsive padding ══════════════ */}
    </>
  )
}
