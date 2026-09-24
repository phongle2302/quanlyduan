import type { ReactNode } from 'react'
import './Modal.css'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-card__header">
          <h3>{title}</h3>
          <button className="modal-card__close" onClick={onClose} type="button" aria-label="Đóng">
            ✕
          </button>
        </div>
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  )
}
