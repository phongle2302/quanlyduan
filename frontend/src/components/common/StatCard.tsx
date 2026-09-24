import type { ReactNode } from 'react'
import './StatCard.css'

interface StatCardProps {
  label: string
  value: string
  icon: ReactNode
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  hint?: string
}

export default function StatCard({ label, value, icon, tone = 'primary', hint }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className={`stat-card__icon stat-card__icon--${tone}`}>{icon}</div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <h3 className="stat-card__value">{value}</h3>
        {hint && <p className="stat-card__hint">{hint}</p>}
      </div>
    </div>
  )
}
