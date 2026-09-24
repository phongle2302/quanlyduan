export function formatCurrency(value: number | string): string {
  return Number(value).toLocaleString('vi-VN') + ' đ'
}

export function formatDate(value: string): string {
  const [y, m, d] = value.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function daysUntil(value: string): number {
  const target = new Date(value.slice(0, 10)).getTime()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target - today.getTime()) / 86_400_000)
}
