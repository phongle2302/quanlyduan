import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import './MainLayout.css'

interface MainLayoutProps {
  title: string
  children: ReactNode
}

export default function MainLayout({ title, children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__content">
        <Header title={title} />
        <main className="main-layout__body">{children}</main>
      </div>
    </div>
  )
}
