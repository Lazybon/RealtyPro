export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatShortPrice(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} млн`;
  }
  return value.toLocaleString('ru-RU');
}

export function formatPricePerSqm(price: number, area: number, currency: string): string {
  const pricePerSqm = Math.round(price / area);
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(pricePerSqm);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
