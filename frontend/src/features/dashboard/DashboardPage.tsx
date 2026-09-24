import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable from '../../components/common/DataTable'
import { IconBook, IconFileContract, IconLoan, IconReader } from '../../components/common/icons'
import { books, loanSlips, readers, supplierContracts } from '../../services/mockData'
import { formatDate } from '../../utils/format'
import './DashboardPage.css'

export default function DashboardPage() {
  const activeContracts = supplierContracts.filter((c) => c.status === 'active').length
  const expiringContracts = supplierContracts.filter((c) => c.status === 'expiring')
  const overdueLoans = loanSlips.filter((l) => l.status === 'overdue')
  const borrowingLoans = loanSlips.filter((l) => l.status === 'borrowing' || l.status === 'overdue').length
  const activeReaders = readers.filter((r) => r.status === 'active').length
  const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0)

  return (
    <div>
      <PageHeader
        title="Chào mừng trở lại, Trần Nam"
        description="Tổng quan tình trạng hợp đồng, mượn/trả và hồ sơ của thư viện hôm nay."
      />

      <div className="dashboard-stats">
        <StatCard
          label="Hợp đồng đang hiệu lực"
          value={String(activeContracts)}
          icon={<IconFileContract />}
          tone="primary"
          hint={`${expiringContracts.length} hợp đồng sắp hết hạn`}
        />
        <StatCard
          label="Phiếu đang mượn"
          value={String(borrowingLoans)}
          icon={<IconLoan />}
          tone="success"
          hint={`${overdueLoans.length} phiếu quá hạn`}
        />
        <StatCard
          label="Độc giả đang hoạt động"
          value={String(activeReaders)}
          icon={<IconReader />}
          tone="warning"
          hint={`${readers.length} tổng số hồ sơ độc giả`}
        />
        <StatCard
          label="Tổng số đầu sách"
          value={String(totalBooks)}
          icon={<IconBook />}
          tone="danger"
          hint={`${books.length} tựa sách trong hệ thống`}
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
            data={expiringContracts}
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
              { key: 'reader', header: 'Độc giả', render: (r) => r.readerName },
              { key: 'book', header: 'Sách', render: (r) => r.bookTitle },
              { key: 'due', header: 'Hạn trả', render: (r) => formatDate(r.dueDate) },
              {
                key: 'status',
                header: 'Trạng thái',
                render: () => <StatusBadge label="Quá hạn" tone="danger" />,
              },
            ]}
            data={overdueLoans}
            getRowId={(r) => r.id}
            emptyText="Không có phiếu nào quá hạn"
          />
        </section>
      </div>
    </div>
  )
}
