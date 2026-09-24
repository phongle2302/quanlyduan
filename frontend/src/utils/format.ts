export function formatCurrency(value: number): string {
  return value.toLocaleString('vi-VN') + ' đ'
}

export function formatDate(value: string): string {
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}
