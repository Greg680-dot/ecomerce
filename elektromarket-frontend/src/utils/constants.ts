export const APP_NAME = 'ElektroMarket Germany'
export const APP_TAGLINE = 'Premium Elektronik für Deutschland'

export const API_BASE_URL = "http://localhost:8000/api/v1"

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/produkte',
  PRODUCT_DETAIL: '/produkte/:slug',
  SEARCH: '/suche',
  PROMOTIONS: '/aktionen',
  NEW_ARRIVALS: '/neuheiten',
  COMPARE: '/vergleich',
  CART: '/warenkorb',
  CHECKOUT: '/kasse',
  LOGIN: '/anmelden',
  REGISTER: '/registrieren',
  DASHBOARD: '/konto',
  PROFILE: '/konto/profil',
  ADDRESSES: '/konto/adressen',
  WISHLIST: '/konto/wunschliste',
  ORDERS: '/konto/bestellungen',
  ORDER_DETAIL: '/konto/bestellungen/:id',
  NOTIFICATIONS: '/konto/benachrichtigungen',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/benutzer',
  ADMIN_PRODUCTS: '/admin/produkte',
  ADMIN_CATEGORIES: '/admin/kategorien',
  ADMIN_ORDERS: '/admin/bestellungen',
  ADMIN_PAYMENTS: '/admin/zahlungen',
  ADMIN_REVIEWS: '/admin/bewertungen',
  ADMIN_PROMOTIONS: '/admin/aktionen',
  ADMIN_ANALYTICS: '/admin/analysen',
  ADMIN_SETTINGS: '/admin/einstellungen',
  ADMIN_STOCK: '/admin/lager',
  ADMIN_RETURNS: '/admin/retouren',
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  processing: 'In Bearbeitung',
  shipped: 'Versendet',
  delivered: 'Zugestellt',
  cancelled: 'Storniert',
  returned: 'Retourniert',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  paid: 'Bezahlt',
  failed: 'Fehlgeschlagen',
  refunded: 'Erstattet',
}

export const DEFAULT_PAGE_SIZE = 12

export const MAX_COMPARE_ITEMS = 4

export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Sommer-Sale',
    subtitle: 'Bis zu 40% auf ausgewählte Elektronik',
    cta: 'Jetzt shoppen',
    link: '/aktionen',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    id: 2,
    title: 'Neue Smartphones',
    subtitle: 'Die neuesten Modelle von Apple, Samsung & mehr',
    cta: 'Entdecken',
    link: '/neuheiten',
    gradient: 'from-blue-900 to-indigo-800',
  },
  {
    id: 3,
    title: 'Smart Home',
    subtitle: 'Verbinden Sie Ihr Zuhause intelligent',
    cta: 'Mehr erfahren',
    link: '/produkte?category=smart-home',
    gradient: 'from-emerald-700 to-teal-800',
  },
]

export const FOOTER_LINKS = {
  shop: [
    { label: 'Alle Produkte', href: '/produkte' },
    { label: 'Neuheiten', href: '/neuheiten' },
    { label: 'Aktionen', href: '/aktionen' },
    { label: 'Marken', href: '/produkte?brand=all' },
  ],
  service: [
    { label: 'Mein Konto', href: '/konto' },
    { label: 'Bestellungen', href: '/konto/bestellungen' },
    { label: 'Wunschliste', href: '/konto/wunschliste' },
    { label: 'Warenkorb', href: '/warenkorb' },
  ],
  legal: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
    { label: 'Widerrufsrecht', href: '/widerruf' },
  ],
}
