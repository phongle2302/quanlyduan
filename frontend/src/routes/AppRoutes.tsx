import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import SupplierContractsPage from '../features/contracts/SupplierContractsPage'
import LoanSlipsPage from '../features/contracts/LoanSlipsPage'
import ReadersPage from '../features/borrowers/ReadersPage'
import BooksPage from '../features/documents/BooksPage'
import UsersPage from '../features/users/UsersPage'

function withLayout(title: string, element: React.ReactNode) {
  return (
    <ProtectedRoute>
      <MainLayout title={title}>{element}</MainLayout>
    </ProtectedRoute>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={withLayout('Bảng điều khiển', <DashboardPage />)} />
      <Route path="/contracts" element={withLayout('Hợp đồng nhà cung cấp', <SupplierContractsPage />)} />
      <Route path="/loans" element={withLayout('Phiếu mượn / trả', <LoanSlipsPage />)} />
      <Route path="/readers" element={withLayout('Hồ sơ độc giả', <ReadersPage />)} />
      <Route path="/books" element={withLayout('Hồ sơ sách / tài liệu', <BooksPage />)} />
      <Route path="/users" element={withLayout('Người dùng hệ thống', <UsersPage />)} />
    </Routes>
  )
}
