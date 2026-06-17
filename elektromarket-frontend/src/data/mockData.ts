import type { Category, Product, Order, User, Promotion } from '../types'

export const mockCategories: Category[] = [
  { id: '1', name: 'Smartphones', slug: 'smartphones', productCount: 124, isActive: true, image: 'https://picsum.photos/seed/phone/200/200' },
  { id: '2', name: 'Laptops', slug: 'laptops', productCount: 89, isActive: true, image: 'https://picsum.photos/seed/laptop/200/200' },
  { id: '3', name: 'TV & Audio', slug: 'tv-audio', productCount: 156, isActive: true, image: 'https://picsum.photos/seed/tv/200/200' },
  { id: '4', name: 'Smart Home', slug: 'smart-home', productCount: 67, isActive: true, image: 'https://picsum.photos/seed/smarthome/200/200' },
  { id: '5', name: 'Gaming', slug: 'gaming', productCount: 98, isActive: true, image: 'https://picsum.photos/seed/gaming/200/200' },
  { id: '6', name: 'Haushalt', slug: 'haushalt', productCount: 203, isActive: true, image: 'https://picsum.photos/seed/home/200/200' },
]

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Samsung Galaxy S25 Ultra 512GB', slug: 'samsung-galaxy-s25-ultra',
    description: 'Das leistungsstärkste Galaxy Smartphone mit KI-Funktionen, 200MP Kamera und S Pen.',
    shortDescription: 'Flaggschiff-Smartphone mit KI',
    sku: 'SAM-S25U-512', price: 1299.99, originalPrice: 1449.99, discountPercent: 10,
    categoryId: '1', brand: 'Samsung',
    images: [{ id: '1', url: 'https://picsum.photos/seed/s25/600/600', alt: 'Samsung Galaxy S25', isPrimary: true }],
    specs: [{ key: 'Display', value: '6.8" Dynamic AMOLED' }, { key: 'Speicher', value: '512 GB' }],
    stock: 15, rating: 4.8, reviewCount: 234, isNew: true, isFeatured: true, isOnSale: true,
    tags: ['smartphone', 'samsung'], createdAt: '2026-01-15', updatedAt: '2026-03-01',
  },
  {
    id: '2', name: 'Apple MacBook Pro 14" M4 Pro', slug: 'macbook-pro-14-m4',
    description: 'Professioneller Laptop mit M4 Pro Chip, Liquid Retina XDR Display und 18h Akkulaufzeit.',
    sku: 'APL-MBP14-M4', price: 2499.00, categoryId: '2', brand: 'Apple',
    images: [{ id: '2', url: 'https://picsum.photos/seed/macbook/600/600', alt: 'MacBook Pro', isPrimary: true }],
    specs: [{ key: 'Chip', value: 'Apple M4 Pro' }, { key: 'RAM', value: '18 GB' }],
    stock: 8, rating: 4.9, reviewCount: 156, isNew: true, isFeatured: true, isOnSale: false,
    tags: ['laptop', 'apple'], createdAt: '2026-02-01', updatedAt: '2026-03-01',
  },
  {
    id: '3', name: 'Sony Bravia XR 65" OLED 4K', slug: 'sony-bravia-xr-65',
    description: 'Premium OLED Fernseher mit Cognitive Processor XR und Dolby Vision.',
    sku: 'SNY-XR65-OLED', price: 1899.00, originalPrice: 2299.00, discountPercent: 17,
    categoryId: '3', brand: 'Sony',
    images: [{ id: '3', url: 'https://picsum.photos/seed/sonytv/600/600', alt: 'Sony Bravia', isPrimary: true }],
    specs: [{ key: 'Größe', value: '65 Zoll' }, { key: 'Auflösung', value: '4K OLED' }],
    stock: 5, rating: 4.7, reviewCount: 89, isNew: false, isFeatured: true, isOnSale: true,
    tags: ['tv', 'sony'], createdAt: '2025-11-01', updatedAt: '2026-03-01',
  },
  {
    id: '4', name: 'PlayStation 5 Pro', slug: 'playstation-5-pro',
    description: 'Die ultimative Gaming-Konsole mit 4K 120fps und Raytracing.',
    sku: 'SNY-PS5-PRO', price: 749.99, categoryId: '5', brand: 'Sony',
    images: [{ id: '4', url: 'https://picsum.photos/seed/ps5/600/600', alt: 'PS5 Pro', isPrimary: true }],
    specs: [{ key: 'Speicher', value: '2 TB SSD' }],
    stock: 22, rating: 4.8, reviewCount: 412, isNew: true, isFeatured: true, isOnSale: false,
    tags: ['gaming', 'console'], createdAt: '2026-01-01', updatedAt: '2026-03-01',
  },
  {
    id: '5', name: 'Dyson V15 Detect Absolute', slug: 'dyson-v15-detect',
    description: 'Kabelloser Staubsauger mit Laser-Stauberkennung und 60 Min. Laufzeit.',
    sku: 'DYS-V15-ABS', price: 649.99, originalPrice: 749.99, discountPercent: 13,
    categoryId: '6', brand: 'Dyson',
    images: [{ id: '5', url: 'https://picsum.photos/seed/dyson/600/600', alt: 'Dyson V15', isPrimary: true }],
    specs: [{ key: 'Leistung', value: '230 AW' }],
    stock: 30, rating: 4.6, reviewCount: 178, isNew: false, isFeatured: false, isOnSale: true,
    tags: ['haushalt'], createdAt: '2025-09-01', updatedAt: '2026-03-01',
  },
  {
    id: '6', name: 'Bose QuietComfort Ultra', slug: 'bose-qc-ultra',
    description: 'Premium Noise-Cancelling Kopfhörer mit immersivem Audio.',
    sku: 'BOS-QC-ULTRA', price: 379.99, categoryId: '3', brand: 'Bose',
    images: [{ id: '6', url: 'https://picsum.photos/seed/bose/600/600', alt: 'Bose QC Ultra', isPrimary: true }],
    specs: [{ key: 'Typ', value: 'Over-Ear' }],
    stock: 45, rating: 4.7, reviewCount: 267, isNew: false, isFeatured: true, isOnSale: false,
    tags: ['audio'], createdAt: '2025-06-01', updatedAt: '2026-03-01',
  },
  {
    id: '7', name: 'iPhone 16 Pro Max 256GB', slug: 'iphone-16-pro-max',
    description: 'Apples neuestes Flaggschiff mit A18 Pro Chip und Titanium Design.',
    sku: 'APL-IP16PM-256', price: 1449.00, categoryId: '1', brand: 'Apple',
    images: [{ id: '7', url: 'https://picsum.photos/seed/iphone16/600/600', alt: 'iPhone 16 Pro Max', isPrimary: true }],
    specs: [{ key: 'Display', value: '6.9" Super Retina XDR' }],
    stock: 20, rating: 4.9, reviewCount: 345, isNew: true, isFeatured: true, isOnSale: false,
    tags: ['smartphone', 'apple'], createdAt: '2025-09-20', updatedAt: '2026-03-01',
  },
  {
    id: '8', name: 'Philips Hue Starter Set', slug: 'philips-hue-starter',
    description: 'Smart Home Beleuchtungsset mit 3 E27 Lampen und Bridge.',
    sku: 'PHI-HUE-START', price: 129.99, originalPrice: 159.99, discountPercent: 19,
    categoryId: '4', brand: 'Philips',
    images: [{ id: '8', url: 'https://picsum.photos/seed/hue/600/600', alt: 'Philips Hue', isPrimary: true }],
    specs: [{ key: 'Lampen', value: '3x E27' }],
    stock: 60, rating: 4.5, reviewCount: 523, isNew: false, isFeatured: false, isOnSale: true,
    tags: ['smart-home'], createdAt: '2025-01-01', updatedAt: '2026-03-01',
  },
]

export const mockPromotions: Promotion[] = [
  { id: '1', title: 'Sommer-Sale', description: 'Bis zu 40% Rabatt auf ausgewählte Produkte', discountType: 'percentage', discountValue: 40, startDate: '2026-06-01', endDate: '2026-08-31', isActive: true, image: 'https://picsum.photos/seed/summer/800/400' },
  { id: '2', title: 'Smartphone-Woche', description: 'Extra 10% auf alle Smartphones mit Code PHONE10', code: 'PHONE10', discountType: 'percentage', discountValue: 10, startDate: '2026-06-01', endDate: '2026-06-14', isActive: true, image: 'https://picsum.photos/seed/phones/800/400' },
]

export const mockOrders: Order[] = [
  {
    id: '1', orderNumber: 'EM-2026-001234', userId: '1', status: 'delivered',
    items: [{ id: '1', productId: '1', productName: 'Samsung Galaxy S25 Ultra', productImage: 'https://picsum.photos/seed/s25/100/100', quantity: 1, price: 1299.99, total: 1299.99 }],
    subtotal: 1299.99, shippingCost: 0, tax: 247.00, total: 1546.99,
    shippingAddress: { id: '1', userId: '1', label: 'Zuhause', firstName: 'Max', lastName: 'Mustermann', street: 'Hauptstr. 1', city: 'Berlin', postalCode: '10115', country: 'DE', phone: '+491701234567', isDefault: true },
    billingAddress: { id: '1', userId: '1', label: 'Zuhause', firstName: 'Max', lastName: 'Mustermann', street: 'Hauptstr. 1', city: 'Berlin', postalCode: '10115', country: 'DE', phone: '+491701234567', isDefault: true },
    paymentMethod: 'PayPal', paymentStatus: 'paid', trackingNumber: 'DHL1234567890',
    createdAt: '2026-05-15', updatedAt: '2026-05-18',
  },
]

export const mockUsers: User[] = [
  { id: '1', email: 'max@example.de', firstName: 'Max', lastName: 'Mustermann', role: 'customer', isVerified: true, createdAt: '2025-01-01', updatedAt: '2026-01-01' },
  { id: '2', email: 'admin@elektromarket.de', firstName: 'Admin', lastName: 'User', role: 'admin', isVerified: true, createdAt: '2024-01-01', updatedAt: '2026-01-01' },
]
