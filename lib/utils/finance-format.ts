export function formatCurrency(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${value.toFixed(2)}`;
  }
}

export function formatPercent(value: number, digits = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

export function monthLabel(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleString('en-US', { month: 'short' });
}

export function yearMonthKey(input: string | Date) {
  const date = typeof input === 'string' ? new Date(input) : input;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
