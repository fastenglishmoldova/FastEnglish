'use client'

import { useState, useRef, useEffect } from 'react'

/* ─── Icons ─────────────────────────────────────────────────── */
const IcoPin = () => (
  <svg width="20" height="20" fill="none" stroke="#C8102E" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
)
const IcoPhone = () => (
  <svg width="20" height="20" fill="none" stroke="#C8102E" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
)
const IcoMail = () => (
  <svg width="20" height="20" fill="none" stroke="#C8102E" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
)
const IcoClock = () => (
  <svg width="20" height="20" fill="none" stroke="#C8102E" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
  </svg>
)
const IcoSend = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
  </svg>
)
const IcoArrow = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
  </svg>
)
const IcoMap = () => (
  <svg width="16" height="16" fill="none" stroke="#C8102E" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
  </svg>
)

/* ─── Big Ben + Bus SVG ──────────────────────────────────────── */
const BigBenSVG = ({ opacity = 0.09, scale = 1 }) => (
  <svg
    width={220 * scale} height={420 * scale}
    viewBox="0 0 220 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Tower base */}
    <rect x="75" y="290" width="70" height="130" rx="2" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    {/* Tower mid sections */}
    <rect x="80" y="255" width="60" height="38" rx="1" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    <rect x="82" y="218" width="56" height="40" rx="1" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    <rect x="85" y="182" width="50" height="38" rx="1" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    {/* Clock section */}
    <rect x="78" y="135" width="64" height="50" rx="2" stroke="#012169" strokeWidth="1.8" opacity={opacity}/>
    <circle cx="110" cy="160" r="20" stroke="#012169" strokeWidth="1.8" opacity={opacity}/>
    <line x1="110" y1="145" x2="110" y2="160" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    <line x1="110" y1="160" x2="122" y2="160" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    {/* Ornamental top */}
    <rect x="80" y="98" width="60" height="40" rx="2" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    <rect x="88" y="72" width="44" height="28" rx="2" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    {/* Spire */}
    <polygon points="110,12 88,72 132,72" stroke="#012169" strokeWidth="1.5" fill="none" opacity={opacity}/>
    <line x1="110" y1="12" x2="110" y2="5" stroke="#012169" strokeWidth="1.5" opacity={opacity}/>
    {/* Corner details */}
    <line x1="75" y1="290" x2="55" y2="290" stroke="#012169" strokeWidth="1" opacity={opacity * 0.6}/>
    <line x1="145" y1="290" x2="165" y2="290" stroke="#012169" strokeWidth="1" opacity={opacity * 0.6}/>
    <line x1="55" y1="290" x2="55" y2="420" stroke="#012169" strokeWidth="1" opacity={opacity * 0.5}/>
    <line x1="165" y1="290" x2="165" y2="420" stroke="#012169" strokeWidth="1" opacity={opacity * 0.5}/>
    {/* Windows on tower */}
    <rect x="95" y="310" width="12" height="18" rx="6" stroke="#012169" strokeWidth="1" opacity={opacity * 0.7}/>
    <rect x="113" y="310" width="12" height="18" rx="6" stroke="#012169" strokeWidth="1" opacity={opacity * 0.7}/>
    <rect x="95" y="340" width="12" height="18" rx="6" stroke="#012169" strokeWidth="1" opacity={opacity * 0.7}/>
    <rect x="113" y="340" width="12" height="18" rx="6" stroke="#012169" strokeWidth="1" opacity={opacity * 0.7}/>
    {/* Red double-decker bus */}
    <rect x="20" y="365" width="85" height="42" rx="5" fill="#C8102E" opacity="0.13"/>
    <rect x="20" y="365" width="85" height="42" rx="5" stroke="#C8102E" strokeWidth="1.5" opacity="0.25"/>
    {/* Bus windows upper deck */}
    <rect x="27" y="370" width="14" height="10" rx="2" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
    <rect x="45" y="370" width="14" height="10" rx="2" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
    <rect x="63" y="370" width="14" height="10" rx="2" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
    <rect x="81" y="370" width="16" height="10" rx="2" stroke="#C8102E" strokeWidth="1" opacity="0.3"/>
    {/* Bus wheels */}
    <circle cx="38" cy="407" r="7" stroke="#C8102E" strokeWidth="1.5" opacity="0.25"/>
    <circle cx="88" cy="407" r="7" stroke="#C8102E" strokeWidth="1.5" opacity="0.25"/>
  </svg>
)

/* ─── Filiale ───────────────────────────────────────────────── */
const BRANCHES = [
  {
    id: 'centru',
    name: 'Centru',
    address: 'Bd. Ștefan cel Mare 123',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5682.9!2d28.8322701!3d47.0245117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x37d1d6305749dd5b!2sCentru%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sro!2s!4v1718100000001!5m2!1sro!2s',
  },
  {
    id: 'ciocana',
    name: 'Ciocana',
    address: 'Str. Petricani 25',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5682.9!2d28.8892!3d47.0467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97dbf67a28b59%3A0x6bb2b7fba5a7bc24!2sCiocana%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sro!2s!4v1718100000002!5m2!1sro!2s',
  },
  {
    id: 'botanica',
    name: 'Botanica',
    address: 'Bd. Dacia 35',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5682.9!2d28.8419!3d47.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c23a12d1123%3A0xb8a527f4c1c9d3c8!2sBotanica%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sro!2s!4v1718100000003!5m2!1sro!2s',
  },
]

/* ─── Google Maps embed ──────────────────────────────────────── */
const MiniMap = ({ src }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
    <iframe
      title="Fast English - Locație Chișinău"
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0, display: 'block' }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
)

/* ─── Info item ─────────────────────────────────────────────── */
function InfoItem({ icon, label, lines }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: 'rgba(200,16,46,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>{label}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.6 }}>{l}</div>
        ))}
      </div>
    </div>
  )
}

/* ─── Input style ───────────────────────────────────────────── */
const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 16px',
  border: '1.5px solid #E8E0D5',
  borderRadius: 12,
  fontSize: 14, color: '#1a1a2e',
  background: '#FAFAF9',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
}

/* ─── Main component ─────────────────────────────────────────── */
export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')
  const [visible, setVisible]   = useState(false)
  const [focused, setFocused]   = useState('')
  const [selectedBranch, setSelectedBranch] = useState('centru')
  const sectionRef = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: `Subiect: ${form.subject}\n\n${form.message}` }),
      })
      if (res.ok) { setSuccess(true); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }
      else { const d = await res.json(); setError(d.error || 'A apărut o eroare.') }
    } catch { setError('A apărut o eroare. Încearcă din nou.') }
    finally { setLoading(false) }
  }

  const focusStyle = (field) => focused === field ? { ...inputStyle, borderColor: '#C8102E', background: '#fff' } : inputStyle

  return (
    <section id="contact" ref={sectionRef} style={{ background: '#FFFBF5', position: 'relative', overflow: 'hidden' }}>

      {/* ── Dot grid top-left ── */}
      <div style={{
        position: 'absolute', left: 40, top: 40,
        backgroundImage: 'radial-gradient(circle, #C8102E22 1.5px, transparent 1.5px)',
        backgroundSize: '16px 16px',
        width: 100, height: 90, opacity: 0.6, pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Big Ben decorative background ── */}
      <div style={{
        position: 'absolute', left: -20, bottom: 0, zIndex: 0, pointerEvents: 'none',
      }}>
        <BigBenSVG opacity={0.09} scale={1.1} />
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '88px 64px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1.1fr',
        gap: 64, alignItems: 'start', position: 'relative', zIndex: 1,
      }} className="contact-grid">

        {/* ── LEFT: Info ── */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 32, height: 2.5, background: '#C8102E', borderRadius: 99 }} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8102E' }}>
              Contact
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            margin: '0 0 20px',
            fontSize: 'clamp(28px, 3.2vw, 44px)',
            fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.15,
            color: '#1a1a2e',
          }}>
            Hai să vorbim!<br />
            Suntem aici{' '}
            <span style={{
              background: 'linear-gradient(120deg, #012169 0%, #1e3a8a 45%, #C8102E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>să te ajutăm.</span>
          </h2>

          {/* Subtitle */}
          <p style={{ margin: '0 0 40px', fontSize: 16, color: '#6B7280', lineHeight: 1.75, maxWidth: 420 }}>
            Ai o întrebare, vrei mai multe informații sau ești gata să începi
            călătoria în limba engleză? Completează formularul și îți răspundem
            cât mai rapid.
          </p>

          {/* Info list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <InfoItem icon={<IcoPin />}   label="Adresă"  lines={['Chișinău, Moldova']} />
            <InfoItem icon={<IcoPhone />} label="Telefon" lines={['060 331 177']} />
            <InfoItem icon={<IcoMail />}  label="Email"   lines={['fast.english.moldova@gmail.com']} />
            <InfoItem icon={<IcoClock />} label="Program" lines={['Luni – Vineri: 09:00 – 19:00', 'Sâmbătă: 10:00 – 14:00']} />
          </div>
        </div>

        {/* ── RIGHT: Form card ── */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #E8E0D5',
          borderRadius: 24,
          padding: '36px 36px 32px',
          boxShadow: '0 12px 48px rgba(1,33,105,0.08)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease 0.12s, transform 0.7s ease 0.12s',
        }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'rgba(200,16,46,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#C8102E', flexShrink: 0,
            }}>
              <IcoSend />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>
                Trimite-ne un mesaj
              </div>
              <div style={{ fontSize: 13.5, color: '#6B7280' }}>
                Îți vom răspunde în cel mai scurt timp.
              </div>
            </div>
          </div>

          {success ? (
            <div style={{
              padding: '32px 24px', textAlign: 'center',
              background: 'rgba(200,16,46,0.05)', borderRadius: 16,
              border: '1.5px solid rgba(200,16,46,0.15)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>
                Mesaj trimis cu succes!
              </div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>
                Îți vom răspunde în cel mai scurt timp. Mulțumim!
              </div>
              <button
                onClick={() => setSuccess(false)}
                style={{ marginTop: 20, fontSize: 13, color: '#C8102E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Trimite alt mesaj
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  type="text" placeholder="Nume complet" required
                  value={form.name} onChange={set('name')}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  style={focusStyle('name')}
                />
                <input
                  type="email" placeholder="Email" required
                  value={form.email} onChange={set('email')}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  style={focusStyle('email')}
                />
              </div>
              {/* Row 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  type="tel" placeholder="Telefon"
                  value={form.phone} onChange={set('phone')}
                  onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                  style={focusStyle('phone')}
                />
                <input
                  type="text" placeholder="Subiect"
                  value={form.subject} onChange={set('subject')}
                  onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                  style={focusStyle('subject')}
                />
              </div>
              {/* Textarea */}
              <textarea
                placeholder="Mesajul tău" rows={5} required
                value={form.message} onChange={set('message')}
                onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                style={{ ...focusStyle('message'), resize: 'vertical', marginBottom: 16 }}
              />

              {error && (
                <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(200,16,46,0.07)', color: '#C8102E', fontSize: 13.5, fontWeight: 500 }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px 0',
                  background: loading ? '#9E0A23' : 'linear-gradient(135deg,#C8102E 0%,#9E0A23 100%)',
                  color: '#ffffff', fontWeight: 700, fontSize: 15.5,
                  border: 'none', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 6px 20px rgba(200,16,46,0.28)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(200,16,46,0.38)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,16,46,0.28)' }}
              >
                {loading ? 'Se trimite…' : 'Trimite mesajul'}
                {!loading && <IcoArrow />}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ══════════ LOCATION CARD ══════════ */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 64px 88px',
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
      }}>
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #E8E0D5',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(1,33,105,0.07)',
          display: 'grid', gridTemplateColumns: '280px 1fr',
        }} className="location-card">

          {/* Left: branch selector */}
          <div style={{
            padding: '36px 28px',
            borderRight: '1.5px solid #E8E0D5',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>
              Filialele noastre
            </div>

            {/* Branch tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              {BRANCHES.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                    background: selectedBranch === b.id ? 'rgba(200,16,46,0.08)' : 'transparent',
                    transition: 'background 0.18s',
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: selectedBranch === b.id ? '#C8102E' : '#D1D5DB',
                    transition: 'background 0.18s',
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: selectedBranch === b.id ? '#C8102E' : '#1a1a2e' }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                      {b.address}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Open in Maps */}
            <button
              onClick={() => {
                const b = BRANCHES.find(x => x.id === selectedBranch)
                window.open(`https://maps.google.com/?q=${encodeURIComponent((b?.address || '') + ', Chișinău, Moldova')}`, '_blank')
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 13.5, fontWeight: 700, color: '#C8102E',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              <IcoMap />
              Deschide în Google Maps
              <IcoArrow />
            </button>

            {/* Illustration */}
            <div style={{ marginTop: 'auto', paddingTop: 24, opacity: 0.85 }}>
              <BigBenSVG opacity={0.18} scale={0.55} />
            </div>
          </div>

          {/* Right: map – full height */}
          <div style={{ minHeight: 340, height: '100%' }}>
            <MiniMap src={BRANCHES.find(b => b.id === selectedBranch)?.mapSrc} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          grid-template-columns: 1fr 1.1fr;
        }
        .location-card {
          grid-template-columns: 280px 1fr;
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            padding: 60px 24px 40px !important;
            gap: 36px !important;
          }
          .location-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
