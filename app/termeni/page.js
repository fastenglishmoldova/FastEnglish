'use client'

import Link from 'next/link'
import { 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ShieldExclamationIcon,
  CameraIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

export default function TermsPage() {
  const sections = [
    {
      id: 1,
      title: 'Dispoziții generale',
      icon: DocumentTextIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Prezentul document stabilește termenii și condițiile de participare la programele oferite de Centrul Bravito After School. Prin înscrierea copilului, părintele/reprezentantul legal confirmă că a citit, a înțeles și acceptă acești termeni.
        </p>
      )
    },
    {
      id: 2,
      title: 'Înscrierea',
      icon: ClipboardDocumentCheckIcon,
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 mb-3 font-medium">2.1. Înscrierea se face în baza:</p>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
                Completării formularului de înscriere
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
                Semnării contractului de prestări servicii educaționale
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
                Achitării taxei aferente programului ales
              </li>
            </ul>
          </div>
          <p className="text-gray-600">
            <span className="font-medium">2.2.</span> Locurile sunt limitate și se ocupă în ordinea confirmării înscrierii.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: 'Programul After School',
      icon: AcademicCapIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">3.1.</span> Programele includ activități educaționale, recreative și de sprijin școlar, conform programului stabilit de centru.
          </p>
          <p>
            <span className="font-medium">3.2.</span> Centrul nu înlocuiește instituția de învățământ și nu garantează rezultate școlare specifice, însă oferă sprijin educațional adaptat nevoilor copilului.
          </p>
          <p>
            <span className="font-medium">3.3.</span> Copiii trebuie aduși și preluați la orele stabilite.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: 'Obligațiile centrului',
      icon: BuildingOfficeIcon,
      content: (
        <div>
          <p className="text-gray-600 mb-3">Centrul se obligă să:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30919f] mt-2 flex-shrink-0"></span>
              Asigure un mediu sigur și adecvat copiilor
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30919f] mt-2 flex-shrink-0"></span>
              Desfășoare activități educaționale conform programului
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30919f] mt-2 flex-shrink-0"></span>
              Informeze părinții despre evoluția copilului
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30919f] mt-2 flex-shrink-0"></span>
              Respecte confidențialitatea datelor personale
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 5,
      title: 'Obligațiile părinților/reprezentanților legali',
      icon: UserGroupIcon,
      content: (
        <div>
          <p className="text-gray-600 mb-3">Părinții au obligația să:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
              Furnizeze informații corecte și complete
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
              Respecte programul și regulile centrului
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
              Achite taxele la termenele stabilite
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f8b316] mt-2 flex-shrink-0"></span>
              Anunțe orice problemă medicală sau situație specială a copilului
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      title: 'Regulile de conduită',
      icon: HeartIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">6.1.</span> Copiii trebuie să manifeste un comportament respectuos față de personal și ceilalți copii.
          </p>
          <p>
            <span className="font-medium">6.2.</span> Comportamentele agresive, limbajul nepotrivit sau distrugerea bunurilor pot duce la suspendarea temporară sau definitivă a participării.
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: 'Taxe și plăți',
      icon: CurrencyDollarIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">7.1.</span> Taxele sunt stabilite conform pachetului ales și se achită lunar / conform contractului.
          </p>
          <p>
            <span className="font-medium">7.2.</span> Taxele achitate nu sunt rambursabile în cazul absențelor copilului, cu excepția situațiilor justificate medical.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: 'Absențe și concedii',
      icon: CalendarDaysIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">8.1.</span> Absențele trebuie anunțate în prealabil.
          </p>
          <p>
            <span className="font-medium">8.2.</span> Centrul poate stabili condiții speciale pentru recuperarea activităților, dacă este posibil.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: 'Sănătatea și siguranța copiilor',
      icon: ShieldExclamationIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">9.1.</span> Copiii bolnavi nu pot participa la activități.
          </p>
          <p>
            <span className="font-medium">9.2.</span> În caz de urgență, centrul va anunța imediat părintele și, dacă este necesar, serviciile medicale.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: 'Fotografii și materiale video',
      icon: CameraIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Realizarea și utilizarea materialelor foto-video se face doar cu acordul scris al părintelui/reprezentantului legal.
        </p>
      )
    },
    {
      id: 11,
      title: 'Încetarea participării',
      icon: XCircleIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">11.1.</span> Părintele poate retrage copilul din program cu anunțarea prealabilă cu minim 5 zile înainte de a se încheia luna.
          </p>
          <p>
            <span className="font-medium">11.2.</span> Centrul își rezervă dreptul de a înceta colaborarea în caz de nerespectare a prezentelor condiții.
          </p>
        </div>
      )
    },
    {
      id: 12,
      title: 'Forța majoră',
      icon: ExclamationTriangleIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Centrul nu este responsabil pentru neîndeplinirea obligațiilor în caz de forță majoră (evenimente neprevăzute).
        </p>
      )
    },
    {
      id: 13,
      title: 'Modificarea termenilor',
      icon: PencilSquareIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Centrul își rezervă dreptul de a modifica termenii și condițiile, informând părinții în prealabil.
        </p>
      )
    },
    {
      id: 14,
      title: 'Dispoziții finale',
      icon: CheckBadgeIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Prezentul document face parte integrantă din contractul de prestări servicii educaționale.
        </p>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0c1a1d] to-[#15292e] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#30919f] hover:text-[#4db8c7] mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Înapoi la pagina principală
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#f8b316] to-[#e5a310] rounded-2xl flex items-center justify-center">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Termeni și Condiții</h1>
              <p className="text-gray-400 mt-1">Condițiile de participare la programele Bravito After School</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {sections.map((section) => {
            const IconComponent = section.icon
            return (
              <div 
                key={section.id}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#f8b316]/10 to-[#f8b316]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-[#f8b316]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.id}. {section.title}
                  </h2>
                </div>
                <div className="pl-14">
                  {section.content}
                </div>
              </div>
            )
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#f8b316]/10 to-[#e5a310]/5 rounded-2xl p-6 md:p-8 border border-[#f8b316]/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f8b316] to-[#e5a310] rounded-xl flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Date de contact
              </h2>
            </div>
            <div className="pl-14">
              <p className="text-gray-600 mb-6">
                Pentru orice întrebări sau clarificări:
              </p>
              <div className="bg-white rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Bravito After School</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPinIcon className="w-5 h-5 text-[#f8b316]" />
                    <span>Str. M.V. Bănulescu Bodoni 57/1, of. 316A</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <PhoneIcon className="w-5 h-5 text-[#f8b316]" />
                    <a href="tel:+37369352282" className="hover:text-[#f8b316] transition-colors">
                      +373 69 352 282
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <EnvelopeIcon className="w-5 h-5 text-[#f8b316]" />
                    <a href="mailto:bravito.after.school@gmail.com" className="hover:text-[#f8b316] transition-colors">
                      bravito.after.school@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
          <Link 
            href="/gdpr"
            className="text-[#30919f] hover:text-[#136976] font-medium transition-colors"
          >
            Politica de Confidențialitate (GDPR)
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            href="/"
            className="text-[#30919f] hover:text-[#136976] font-medium transition-colors"
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </div>
  )
}
