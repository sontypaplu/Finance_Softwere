export type DatedValue = { date: string; value: number };

export function percentageChange(current: number, base: number) {
  if (!base) return 0;
  return ((current - base) / base) * 100;
}

export function calculateReturns(series: DatedValue[]) {
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const returns: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1].value;
    const curr = sorted[i].value;
    if (!prev) continue;
    returns.push((curr - prev) / prev);
  }
  return returns;
}

export function standardDeviation(values: number[]) {
  if (!values.length) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function annualizedVolatility(returns: number[], periodsPerYear = 12) {
  return standardDeviation(returns) * Math.sqrt(periodsPerYear) * 100;
}

export function downsideDeviation(returns: number[], periodsPerYear = 12) {
  const downside = returns.filter((value) => value < 0);
  if (!downside.length) return 0;
  const variance = downside.reduce((sum, value) => sum + value ** 2, 0) / downside.length;
  return Math.sqrt(variance) * Math.sqrt(periodsPerYear) * 100;
}

export function maxDrawdown(series: DatedValue[]) {
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  let peak = sorted[0]?.value || 0;
  let drawdown = 0;
  for (const point of sorted) {
    if (point.value > peak) peak = point.value;
    if (peak <= 0) continue;
    const dd = ((point.value - peak) / peak) * 100;
    if (dd < drawdown) drawdown = dd;
  }
  return drawdown;
}

export function cagr(series: DatedValue[]) {
  const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return 0;
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (first.value <= 0 || last.value <= 0) return 0;
  const years = Math.max((new Date(last.date).getTime() - new Date(first.date).getTime()) / (365.25 * 24 * 60 * 60 * 1000), 1 / 12);
  return (Math.pow(last.value / first.value, 1 / years) - 1) * 100;
}

export function sharpeRatio(returns: number[], riskFreeRate = 0.04, periodsPerYear = 12) {
  if (!returns.length) return 0;
  const avg = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const rf = riskFreeRate / periodsPerYear;
  const std = standardDeviation(returns);
  if (!std) return 0;
  return ((avg - rf) / std) * Math.sqrt(periodsPerYear);
}

export function sortinoRatio(returns: number[], riskFreeRate = 0.04, periodsPerYear = 12) {
  if (!returns.length) return 0;
  const avg = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const rf = riskFreeRate / periodsPerYear;
  const dd = downsideDeviation(returns, 1) / 100;
  if (!dd) return 0;
  return ((avg - rf) / dd) * Math.sqrt(periodsPerYear);
}

export function xirr(cashflows: { date: string; amount: number }[], guess = 0.1) {
  if (cashflows.length < 2) return 0;
  const sorted = [...cashflows].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = new Date(sorted[0].date).getTime();

  const xnpv = (rate: number) => sorted.reduce((sum, cashflow) => {
    const years = (new Date(cashflow.date).getTime() - firstDate) / (365.25 * 24 * 60 * 60 * 1000);
    return sum + cashflow.amount / Math.pow(1 + rate, years);
  }, 0);

  let rate = guess;
  for (let i = 0; i < 50; i += 1) {
    const value = xnpv(rate);
    const derivative = (xnpv(rate + 1e-6) - value) / 1e-6;
    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-10) break;
    const next = rate - value / derivative;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-7) {
      rate = next;
      break;
    }
    rate = next;
  }
  return rate * 100;
}

export function correlation(a: number[], b: number[]) {
  if (!a.length || a.length !== b.length) return 0;
  const meanA = a.reduce((s, v) => s + v, 0) / a.length;
  const meanB = b.reduce((s, v) => s + v, 0) / b.length;
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;
  for (let i = 0; i < a.length; i += 1) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    numerator += da * db;
    denomA += da ** 2;
    denomB += db ** 2;
  }
  const denominator = Math.sqrt(denomA * denomB);
  return denominator ? numerator / denominator : 0;
}
