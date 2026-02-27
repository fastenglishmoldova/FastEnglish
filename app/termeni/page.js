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
          Prezentul document stabilește termenii și condițiile de participare la cursurile de limba engleză oferite de FastEnglish. Prin înscrierea la curs, cursantul sau părintele/reprezentantul legal (în cazul minorilor) confirmă că a citit, a înțeles și acceptă acești termeni.
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
                Completării formularului de înscriere online sau în persoană
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
                Efectuării testului de nivel (unde este cazul)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
                Achitării taxei aferente cursului ales
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
      title: 'Cursurile de limba engleză',
      icon: AcademicCapIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">3.1.</span> Cursurile sunt organizate pe niveluri conform Cadrului European Comun de Referință pentru Limbi (A1-C2).
          </p>
          <p>
            <span className="font-medium">3.2.</span> FastEnglish oferă cursuri de grup și individuale, cu frecvență de 2-3 ori pe săptămână, conform programului stabilit.
          </p>
          <p>
            <span className="font-medium">3.3.</span> Progresul cursantului depinde de implicarea și efortul personal. FastEnglish nu garantează rezultate specifice, dar se angajează să ofere cele mai bune condiții de învățare.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: 'Obligațiile FastEnglish',
      icon: BuildingOfficeIcon,
      content: (
        <div>
          <p className="text-gray-600 mb-3">FastEnglish se obligă să:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] mt-2 flex-shrink-0"></span>
              Asigure profesori calificați și experimentați
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] mt-2 flex-shrink-0"></span>
              Desfășoare cursurile conform orarului stabilit
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] mt-2 flex-shrink-0"></span>
              Informeze cursanții despre progresul lor
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] mt-2 flex-shrink-0"></span>
              Respecte confidențialitatea datelor personale
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] mt-2 flex-shrink-0"></span>
              Ofere posibilitatea de recuperare a lecțiilor ratate (conform politicii de recuperări)
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 5,
      title: 'Obligațiile cursanților',
      icon: UserGroupIcon,
      content: (
        <div>
          <p className="text-gray-600 mb-3">Cursanții au obligația să:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
              Furnizeze informații corecte și complete la înscriere
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
              Respecte orarul și regulile centrului
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
              Achite taxele la termenele stabilite
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
              Anunțe absențele în avans pentru a beneficia de recuperări
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E32636] mt-2 flex-shrink-0"></span>
              Participe activ la cursuri și să efectueze temele date
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
            <span className="font-medium">6.1.</span> Cursanții trebuie să manifeste un comportament respectuos față de profesori și ceilalți cursanți.
          </p>
          <p>
            <span className="font-medium">6.2.</span> Comportamentele agresive, limbajul nepotrivit sau perturbarea repetată a cursurilor pot duce la excluderea de la cursuri fără restituirea taxei.
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
            <span className="font-medium">7.1.</span> Taxele sunt stabilite conform cursului și nivelului ales și se achită lunar sau conform contractului.
          </p>
          <p>
            <span className="font-medium">7.2.</span> Plata se poate face în numerar, transfer bancar sau card.
          </p>
          <p>
            <span className="font-medium">7.3.</span> Taxele achitate nu sunt rambursabile, cu excepția cazurilor prevăzute în politica de recuperări.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: 'Absențe și recuperări',
      icon: CalendarDaysIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">8.1.</span> Absențele trebuie anunțate cu minimum 24 de ore înainte pentru a beneficia de posibilitatea de recuperare.
          </p>
          <p>
            <span className="font-medium">8.2.</span> Recuperările se programează în funcție de disponibilitate și trebuie efectuate în aceeași lună calendaristică.
          </p>
          <p>
            <span className="font-medium">8.3.</span> Absențele neanunțate nu pot fi recuperate.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: 'Anularea cursurilor',
      icon: ShieldExclamationIcon,
      content: (
        <div className="space-y-3 text-gray-600">
          <p>
            <span className="font-medium">9.1.</span> FastEnglish își rezervă dreptul de a anula un curs în cazul în care nu se atinge numărul minim de cursanți.
          </p>
          <p>
            <span className="font-medium">9.2.</span> În acest caz, cursanții vor fi redirecționați către alte grupe sau li se va returna taxa achitată.
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
          Realizarea și utilizarea materialelor foto-video în scop de promovare se face doar cu acordul scris al cursantului sau al părintelui/reprezentantului legal (în cazul minorilor).
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
            <span className="font-medium">11.1.</span> Cursantul poate renunța la curs cu anunțare prealabilă de minimum 5 zile înainte de încheierea lunii curente.
          </p>
          <p>
            <span className="font-medium">11.2.</span> FastEnglish își rezervă dreptul de a înceta colaborarea în caz de nerespectare a prezentelor condiții sau neplata taxelor.
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
          FastEnglish nu este responsabil pentru neîndeplinirea obligațiilor în caz de forță majoră (evenimente neprevăzute, pandemii, dezastre naturale, etc.).
        </p>
      )
    },
    {
      id: 13,
      title: 'Modificarea termenilor',
      icon: PencilSquareIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          FastEnglish își rezervă dreptul de a modifica termenii și condițiile, informând cursanții în prealabil cu minimum 30 de zile.
        </p>
      )
    },
    {
      id: 14,
      title: 'Dispoziții finale',
      icon: CheckBadgeIcon,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Prezentul document face parte integrantă din contractul de prestări servicii educaționale încheiat între FastEnglish și cursant.
        </p>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] text-white py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[#E32636] hover:text-[#ff4757] mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Înapoi la pagina principală
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#E32636] to-[#c41e2e] rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold">Termeni și Condiții</h1>
              <p className="text-gray-400 mt-0.5 sm:mt-1 text-xs sm:text-base">Condițiile de participare la cursurile FastEnglish</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-4 sm:space-y-6">
          {sections.map((section) => {
            const IconComponent = section.icon
            return (
              <div 
                key={section.id}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E32636]/10 to-[#E32636]/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#E32636]" />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-gray-900">
                    {section.id}. {section.title}
                  </h2>
                </div>
                <div className="pl-11 sm:pl-14 text-sm sm:text-base">
                  {section.content}
                </div>
              </div>
            )
          })}

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#E32636]/10 to-[#c41e2e]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-[#E32636]/20">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E32636] to-[#c41e2e] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900">
                Date de contact
              </h2>
            </div>
            <div className="pl-11 sm:pl-14">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Pentru orice întrebări sau clarificări:
              </p>
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">FastEnglish</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E32636] flex-shrink-0" />
                    <span>Chișinău, Moldova</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E32636] flex-shrink-0" />
                    <a href="tel:+37379711994" className="hover:text-[#E32636] transition-colors">
                      079 711 994
                    </a>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#E32636] flex-shrink-0" />
                    <a href="mailto:contact@fastenglish.md" className="hover:text-[#E32636] transition-colors break-all">
                      contact@fastenglish.md
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <Link 
            href="/gdpr"
            className="text-[#E32636] hover:text-[#c41e2e] font-medium transition-colors text-sm sm:text-base"
          >
            Politica de Confidențialitate (GDPR)
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link 
            href="/"
            className="text-[#E32636] hover:text-[#c41e2e] font-medium transition-colors text-sm sm:text-base"
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </div>
  )
}
