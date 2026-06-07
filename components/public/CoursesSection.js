'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ─── Small SVG icons for features & categories ───────────────
const Ico = {
  smile:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  star:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>,
  users:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  chat:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  book:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  shield:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  zap:      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  target:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>,
  clipboard:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  pen:      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  award:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path strokeLinecap="round" strokeLinejoin="round" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  briefcase:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  mic:      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>,
  globe:    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
}

function CategoryIcon({ category }) {
  const s = { width:20, height:20 }
  if (category === 'kids')     return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  if (category === 'teens')    return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
  if (category === 'speaking') return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
  if (category === 'exam')     return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
  return <svg {...s} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
}

// ─── Static fallback courses ──────────────────────────────────
const STATIC_COURSES = [
  {
    id: 'kids',
    title: 'English for Kids',
    ageRange: '6–10 ani',
    category: 'kids',
    description: 'Lecții interactive prin povești, jocuri și cântece. Perfect pentru copii care vor să construiască o bază solidă.',
    features: ['Interactiv', 'Activități Fun', 'Grupe Mici'],
    featureIcons: [Ico.smile, Ico.star, Ico.users],
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop&q=80',
    bg: 'linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)',
    buttonNavy: false,
    mostPopular: false,
  },
  {
    id: 'kids2',
    title: 'Little Stars',
    ageRange: '4–6 ani',
    category: 'kids',
    description: 'Primii pași în lumea englezei pentru cei mai mici! Cântece, culori, animale și aventuri — totul în engleză, totul prin joc.',
    features: ['Cântece & Ritm', 'Povești Ilustrate', 'Jocuți Interactive'],
    featureIcons: [Ico.mic, Ico.book, Ico.smile],
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=600&h=600&fit=crop&q=80',
    bg: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)',
    buttonNavy: false,
    mostPopular: false,
  },
  {
    id: 'teens',
    title: 'English for Teens',
    ageRange: '11–16 ani',
    category: 'teens',
    description: 'Construiești încrederea, îmbunătățești gramatica și vorbești fluent. Conversații reale pentru situații reale.',
    features: ['Conversații Reale', 'Gramatică & Vocab', 'Încredere'],
    featureIcons: [Ico.chat, Ico.book, Ico.shield],
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=600&fit=crop&q=80',
    bg: 'linear-gradient(135deg,#012169 0%,#1e3a8a 100%)',
    buttonNavy: true,
    mostPopular: true,
  },
  {
    id: 'speaking',
    title: 'Speaking Club',
    ageRange: '10+ ani',
    category: 'speaking',
    description: 'Exersează vorbitul într-un mediu prietenos. Discuții tematice, jocuri și exprimare naturală.',
    features: ['Discuții de Grup', 'Fluență', 'Fun & Engaging'],
    featureIcons: [Ico.users, Ico.zap, Ico.target],
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=600&fit=crop&q=80',
    bg: 'linear-gradient(135deg,#C8102E 0%,#9E0A23 100%)',
    buttonNavy: false,
    mostPopular: false,
  },
  {
    id: 'exam',
    title: 'Exam Preparation',
    ageRange: '12+ ani',
    category: 'exam',
    description: 'Pregătire pentru Cambridge și alte examene cu îndrumarea experților și practică intensivă.',
    features: ['Strategii Examen', 'Teste Practice', 'Prof. Experți'],
    featureIcons: [Ico.clipboard, Ico.pen, Ico.award],
    slug: '',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&q=80',
    bg: 'linear-gradient(135deg,#6366f1 0%,#4338ca 100%)',
    buttonNavy: false,
    mostPopular: false,
  },
]

const FILTER_TABS = [
  { key: 'all',      label: 'Toate Cursurile' },
  { key: 'kids',     label: 'Kids (6–10)' },
  { key: 'teens',    label: 'Teens (11–16)' },
  { key: 'speaking', label: 'Speaking' },
  { key: 'exam',     label: 'Exam Preparation' },
]

const STATS = [
  {
    bg: '#C8102E',
    icon: <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    label: 'Expert Teachers',
    desc: 'Certified and passionate about your success.',
  },
  {
    bg: '#1e3a8a',
    icon: <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
    label: 'Modern Materials',
    desc: 'Up-to-date resources for real-life learning.',
  },
  {
    bg: '#C8102E',
    icon: <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    label: 'Proven Results',
    desc: 'Students improve faster and speak with confidence.',
  },
  {
    bg: '#1e3a8a',
    icon: <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    label: 'Global Community',
    desc: 'Join learners from around the world.',
  },
]

// ─── Map API course → display format ─────────────────────────
function detectCat(c) {
  const cat   = (c.category || '').toLowerCase()
  const title = (c.title    || '').toLowerCase()
  if (cat.includes('kid') || cat.includes('copil') || (c.ageMax && c.ageMax <= 10)) return 'kids'
  if (cat.includes('speak') || cat.includes('vorb') || title.includes('speak') || title.includes('club')) return 'speaking'
  if (cat.includes('exam') || cat.includes('test') || title.includes('exam') || title.includes('cambridge')) return 'exam'
  if (cat.includes('teen') || (c.ageMin >= 11)) return 'teens'
  return 'teens'
}

function mapCourse(c, idx) {
  const catKey = detectCat(c)
  const ref    = STATIC_COURSES.find(s => s.id === catKey) || STATIC_COURSES[idx % 4]
  return {
    id:          c.id,
    title:       c.title,
    ageRange:    c.ageMin && c.ageMax ? `${c.ageMin}–${c.ageMax} ani` : ref.ageRange,
    category:    catKey,
    description: c.descriptionShort || ref.description,
    features:    ref.features,
    featureIcons: ref.featureIcons,
    slug:        c.slug,
    imageUrl:    c.mainImageUrl || c.imageUrl || null,
    bg:          ref.bg,
    buttonNavy:  ref.buttonNavy,
    mostPopular: idx === 1,
  }
}

// ─── Card ─────────────────────────────────────────────────────
function CourseCard({ course }) {
  const [hov, setHov] = useState(false)
  const dest = course.slug ? `/curs/${course.slug}` : '/inscriere'

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: course.mostPopular ? '2px solid #012169' : '1.5px solid #e2e8f0',
        boxShadow: hov
          ? '0 20px 56px rgba(0,0,0,0.13)'
          : course.mostPopular
            ? '0 8px 28px rgba(1,33,105,0.14)'
            : '0 2px 14px rgba(0,0,0,0.06)',
        transform: hov ? 'translateY(-5px)' : 'none',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
        {course.imageUrl ? (
          <Image src={course.imageUrl} alt={course.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: course.bg }} />
        )}

        {/* Most Popular badge */}
        {course.mostPopular && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#012169', color: '#ffffff',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.07em',
            textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 6,
          }}>
            <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            MOST POPULAR
          </div>
        )}

        {/* Category icon bubble */}
        <div style={{
          position: 'absolute', bottom: -20, left: 18,
          width: 42, height: 42, borderRadius: '50%',
          background: '#C8102E', border: '3px solid #ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(200,16,46,0.32)',
        }}>
          <CategoryIcon category={course.category} />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '28px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title + age */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
            {course.title}
          </h3>
          <span style={{
            fontSize: 12, fontWeight: 600, color: '#C8102E',
            background: 'rgba(200,16,46,0.08)',
            padding: '3px 10px', borderRadius: 99,
            whiteSpace: 'nowrap',
          }}>
            {course.ageRange}
          </span>
        </div>

        {/* Description */}
        <p style={{
          margin: '0 0 16px',
          fontSize: 13.5, color: '#64748b', lineHeight: 1.65,
          flex: 1,
        }}>
          {course.description}
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {course.features.map((f, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 500, color: '#475569',
              background: '#f8fafc', border: '1px solid #e2e8f0',
              padding: '4px 10px', borderRadius: 99,
            }}>
              <span style={{ color: '#C8102E', display:'flex' }}>{course.featureIcons[i]}</span>
              {f}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 16px' }} />

        {/* CTA button */}
        {course.buttonNavy ? (
          <button
            onClick={() => { window.location.href = dest }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '11px 0',
              background: '#012169', color: '#ffffff',
              border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#023a8c'}
            onMouseLeave={e => e.currentTarget.style.background = '#012169'}
          >
            Vizualizează Cursul
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={() => { window.location.href = dest }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, color: '#C8102E',
              padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Explorează Cursul
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────
export default function CoursesSection() {
  const [apiCourses, setApiCourses] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    fetch('/api/public/courses')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setApiCourses(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const allCards = loading
    ? []
    : apiCourses.length > 0
      ? apiCourses.slice(0, 4).map(mapCourse)
      : STATIC_COURSES

  const visible = activeFilter === 'all'
    ? allCards
    : allCards.filter(c => c.category === activeFilter)

  return (
    <section id="cursuri" style={{ background: '#FFFBF5' }}>

      {/* ══ Content ══ */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 64px 64px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>

          {/* Label */}
          <p style={{
            margin: '0 0 12px',
            fontSize: 13, fontWeight: 800, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#C8102E',
          }}>
            Cursurile Noastre
          </p>
          <div style={{
            width: 36, height: 3, background: '#C8102E',
            borderRadius: 99, margin: '0 auto 24px',
          }} />

          {/* Title */}
          <h2 style={{
            margin: '0 0 18px',
            fontSize: 'clamp(26px, 4vw, 46px)',
            fontWeight: 900, letterSpacing: '-0.025em',
            color: '#0f172a', lineHeight: 1.15,
          }}>
            Găsește cursul de engleză{' '}
            <span style={{
              background: 'linear-gradient(120deg, #012169 0%, #1e3a8a 45%, #C8102E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>aproape de tine</span>
          </h2>

          {/* Subtitle */}
          <p style={{
            margin: '0 auto 36px',
            fontSize: 16.5, color: '#64748b', lineHeight: 1.7,
            maxWidth: 560,
          }}>
            Lecții moderne, interactive și distractive pentru a crește încrederea,
            a îmbunătăți comunicarea și a deschide uși spre lume.
          </p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {FILTER_TABS.map(tab => {
              const active = tab.key === activeFilter
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    padding: '9px 22px', borderRadius: 9999,
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background:   active ? '#C8102E' : '#ffffff',
                    color:        active ? '#ffffff' : '#374151',
                    border:       active ? '1.5px solid #C8102E' : '1.5px solid #d1d5db',
                    boxShadow:    active
                      ? '0 4px 14px rgba(200,16,46,0.28)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Cards ── */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 24,
          }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                height: 430, borderRadius: 20, background: '#e8edf3',
              }} />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 24,
          }}>
            {visible.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: 16 }}>Niciun curs găsit pentru această categorie.</p>
          </div>
        )}
      </div>

      {/* ══ Stats bar ══ */}
      <div style={{ background: '#012169', padding: '52px 64px' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 36,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: s.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
