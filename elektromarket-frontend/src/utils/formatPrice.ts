export function formatPrice(
  amount: number,
  options?: { showCurrency?: boolean; compact?: boolean },
): string {
  const { showCurrency = true, compact = false } = options ?? {}

  const formatter = new Intl.NumberFormat('de-DE', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: compact && amount >= 1000 ? 0 : 2,
    maximumFractionDigits: compact && amount >= 1000 ? 0 : 2,
  })

  return formatter.format(amount)
}

export function formatDiscount(original: number, current: number): string {
  const discount = Math.round(((original - current) / original) * 100)
  return `-${discount}%`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
