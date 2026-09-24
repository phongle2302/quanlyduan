import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { IconBook, IconFileContract, IconLoan, IconReader } from '../../components/common/icons'
import { fetchDashboardSummary, type DashboardSummary } from '../../services/dashboardApi'
import { extractErrorMessage } from '../../services/api'
import { getCurrentUser } from '../../services/session'
import { formatDate } from '../../utils/format'
import './DashboardPage.css'

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState('')
  const user = getCurrentUser()

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải số liệu tổng quan')))
  }, [])

  return (
    <div>
      <PageHeader
        title={`Chào mừng trở lại, ${user?.fullName ?? ''}`}
        description="Tổng quan tình trạng hợp đồng, mượn/trả và hồ sơ của thư viện hôm nay."
      />

      {error && <p className="table-card__error">{error}</p>}

      <div className="dashboard-stats">
        <StatCard
          label="Hợp đồng đang hiệu lực"
          value={String(summary?.activeContracts ?? '—')}
          icon={<IconFileContract />}
          tone="primary"
          hint={`${summary?.expiringContracts.length ?? 0} hợp đồng sắp hết hạn`}
        />
        <StatCard
          label="Phiếu đang mượn"
          value={String(summary?.borrowingLoans ?? '—')}
          icon={<IconLoan />}
          tone="success"
          hint={`${summary?.overdueLoans.length ?? 0} phiếu quá hạn`}
        />
        <StatCard
          label="Độc giả đang hoạt động"
          value={String(summary?.activeReaders ?? '—')}
          icon={<IconReader />}
          tone="warning"
          hint={`${summary?.totalReaders ?? 0} tổng số hồ sơ độc giả`}
        />
        <StatCard
          label="Tổng số đầu sách"
          value={String(summary?.totalBooks ?? '—')}
          icon={<IconBook />}
          tone="danger"
          hint={`${summary?.totalBookTitles ?? 0} tựa sách trong hệ thống`}
        />
      </div>

      <div className="dashboard-grid">
        <section className="table-card">
          <div className="table-card__toolbar">
            <h3>Hợp đồng sắp hết hạn</h3>
          </div>
          <DataTable
            columns={[
              { key: 'code', header: 'Mã HĐ', render: (r) => r.code },
              { key: 'title', header: 'Nội dung', render: (r) => r.title },
              { key: 'supplier', header: 'Nhà cung cấp', render: (r) => r.supplierName },
              { key: 'expiry', header: 'Hết hạn', render: (r) => formatDate(r.expiryDate) },
            ]}
            data={summary?.expiringContracts ?? []}
            getRowId={(r) => r.id}
            emptyText="Không có hợp đồng nào sắp hết hạn"
          />
        </section>

        <section className="table-card">
          <div className="table-card__toolbar">
            <h3>Phiếu mượn quá hạn</h3>
          </div>
          <DataTable
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => r.code },
              { key: 'reader', header: 'Độc giả', render: (r) => r.reader.fullName },
              { key: 'book', header: 'Sách', render: (r) => r.book.title },
              { key: 'due', header: 'Hạn trả', render: (r) => formatDate(r.dueDate) },
              {
                key: 'status',
                header: 'Trạng thái',
                render: () => <StatusBadge label="Quá hạn" tone="danger" />,
              },
            ]}
            data={summary?.overdueLoans ?? []}
            getRowId={(r) => r.id}
            emptyText="Không có phiếu nào quá hạn"
          />
        </section>
      </div>
    </div>
  )
}
