export default function BookIllustration() {
  return (
    <svg className="login-visual__art" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="160" cy="214" rx="120" ry="14" fill="#ffffff" opacity="0.12" />

      {/* Chồng sách phía sau */}
      <rect x="44" y="168" width="96" height="14" rx="4" fill="#ffffff" opacity="0.32" />
      <rect x="52" y="152" width="80" height="14" rx="4" fill="#ffffff" opacity="0.24" />
      <rect x="60" y="136" width="64" height="14" rx="4" fill="#ffffff" opacity="0.18" />

      {/* Sách mở */}
      <path d="M160 92c-22-16-48-20-72-14v104c24-6 50-2 72 14V92Z" fill="#ffffff" opacity="0.95" />
      <path d="M160 92c22-16 48-20 72-14v104c-24-6-50-2-72 14V92Z" fill="#ffffff" opacity="0.78" />
      <path d="M160 92v104" stroke="#1d4ed8" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />

      {/* Dòng chữ trên trang trái */}
      <path d="M104 112h40M104 126h40M104 140h30" stroke="#2563eb" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
      {/* Dòng chữ trên trang phải */}
      <path d="M176 112h40M176 126h40M176 140h30" stroke="#2563eb" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />

      {/* Dấu trang */}
      <path d="M196 78v44l12-10 12 10V74" fill="#ffffff" opacity="0.6" />

      {/* Điểm nhấn trang trí */}
      <circle cx="252" cy="52" r="8" fill="#ffffff" opacity="0.35" />
      <circle cx="274" cy="96" r="5" fill="#ffffff" opacity="0.25" />
      <circle cx="56" cy="64" r="6" fill="#ffffff" opacity="0.3" />
    </svg>
  )
}
