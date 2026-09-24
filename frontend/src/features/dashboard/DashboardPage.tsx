import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { IconBook, IconFileContract, IconLoan, IconReader } from '../../components/common/icons'
import { fetchDashboardSummary, type DashboardSummary } from '../../services/dashboardApi'
import { extractErrorMessage } from '../../services/api'
import { getCurrentUser } from '../../services/session'
import { formatDate, daysUntil } from '../../utils/format'
import './DashboardPage.css'

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = getCurrentUser()

  useEffect(() => {
    fetchDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(extractErrorMessage(err, 'Không thể tải số liệu tổng quan')))
      .finally(() => setLoading(false))
  }, [])

  const show = (value: number | undefined) => (loading || value === undefined ? '—' : String(value))

  return (
    <div>
      <PageHeader
        title={`Chào mừng trở lại, ${user?.fullName ?? ''}`}
        description="Tổng quan tình trạng hợp đồng, mượn/trả và hồ sơ của thư viện hôm nay."
      />

      {error && <p className="table-card__error dashboard-error">{error}</p>}

      <div className="dashboard-stats">
        <StatCard
          label="Hợp đồng còn hiệu lực"
          value={show(summary?.activeContracts)}
          icon={<IconFileContract />}
          tone="primary"
          hint={
            summary
              ? `${summary.expiringContracts.length} hợp đồng hết hạn trong 30 ngày tới`
              : 'Đang tải...'
          }
        />
        <StatCard
          label="Sách đang được mượn"
          value={show(summary?.borrowingLoans)}
          icon={<IconLoan />}
          tone="success"
          hint={summary ? `${summary.returnedThisMonth} lượt trả trong tháng này` : 'Đang tải...'}
        />
        <StatCard
          label="Độc giả đang hoạt động"
          value={show(summary?.activeReaders)}
          icon={<IconReader />}
          tone="warning"
          hint={summary ? `${summary.totalReaders} hồ sơ độc giả trong hệ thống` : 'Đang tải...'}
        />
        <StatCard
          label="Bản sách trong kho"
          value={show(summary?.totalBooks)}
          icon={<IconBook />}
          tone="danger"
          hint={
            summary
              ? `${summary.availableBooks} bản còn sẵn / ${summary.totalBookTitles} đầu sách`
              : 'Đang tải...'
          }
        />
      </div>

      <div className="dashboard-grid">
        <section className="table-card">
          <div className="table-card__toolbar">
            <h3>Hợp đồng sắp hết hạn</h3>
            <Link className="dashboard-link" to="/contracts">
              Xem tất cả
            </Link>
          </div>
          <DataTable
            columns={[
              { key: 'code', header: 'Mã HĐ', render: (r) => <span className="cell-code">{r.code}</span> },
              { key: 'title', header: 'Nội dung', render: (r) => r.title },
              { key: 'supplier', header: 'Nhà cung cấp', render: (r) => r.supplierName },
              {
                key: 'expiry',
                header: 'Hết hạn',
                align: 'right',
                render: (r) => {
                  const left = daysUntil(r.expiryDate)
                  return (
                    <div className="cell-stack">
                      <span>{formatDate(r.expiryDate)}</span>
                      <small className={left <= 7 ? 'cell-hint cell-hint--danger' : 'cell-hint'}>
                        {left >= 0 ? `còn ${left} ngày` : `trễ ${Math.abs(left)} ngày`}
                      </small>
                    </div>
                  )
                },
              },
            ]}
            data={summary?.expiringContracts ?? []}
            getRowId={(r) => r.id}
            emptyText={loading ? 'Đang tải dữ liệu...' : 'Không có hợp đồng nào sắp hết hạn'}
          />
        </section>

        <section className="table-card">
          <div className="table-card__toolbar">
            <h3>Phiếu mượn quá hạn</h3>
            <Link className="dashboard-link" to="/loans">
              Xem tất cả
            </Link>
          </div>
          <DataTable
            columns={[
              { key: 'code', header: 'Mã phiếu', render: (r) => <span className="cell-code">{r.code}</span> },
              { key: 'reader', header: 'Độc giả', render: (r) => r.reader.fullName },
              { key: 'book', header: 'Sách', render: (r) => r.book.title },
              {
                key: 'due',
                header: 'Hạn trả',
                align: 'right',
                render: (r) => (
                  <div className="cell-stack">
                    <span>{formatDate(r.dueDate)}</span>
                    <small className="cell-hint cell-hint--danger">trễ {Math.abs(daysUntil(r.dueDate))} ngày</small>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Trạng thái',
                align: 'right',
                render: () => <StatusBadge label="Quá hạn" tone="danger" />,
              },
            ]}
            data={summary?.overdueLoans ?? []}
            getRowId={(r) => r.id}
            emptyText={loading ? 'Đang tải dữ liệu...' : 'Không có phiếu nào quá hạn'}
          />
        </section>
      </div>
    </div>
  )
}
