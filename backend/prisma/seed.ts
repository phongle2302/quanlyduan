import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const today = new Date()

function daysFromNow(days: number): Date {
  const d = new Date(today)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d
}

async function seedUsers() {
  const adminHash = await bcrypt.hash('admin', 10)
  const staffHash = await bcrypt.hash('123456', 10)

  await prisma.systemUser.createMany({
    data: [
      { fullName: 'Quản trị viên', email: 'admin', passwordHash: adminHash, role: 'admin', active: true },
      {
        fullName: 'Nguyễn Thị Lan Anh',
        email: 'lananh.nguyen@thuvien.edu.vn',
        passwordHash: staffHash,
        role: 'librarian',
        active: true,
      },
      {
        fullName: 'Trần Quốc Bảo',
        email: 'quocbao.tran@thuvien.edu.vn',
        passwordHash: staffHash,
        role: 'librarian',
        active: true,
      },
    ],
  })
}

async function seedContracts() {
  const year = today.getFullYear()

  const contracts = [
    {
      title: 'Cung cấp sách giáo trình và tài liệu tham khảo',
      supplierName: 'Nhà xuất bản Giáo dục Việt Nam',
      type: 'Mua sách',
      value: 320_000_000,
      signedDate: daysFromNow(-240),
      expiryDate: daysFromNow(120),
      status: 'active' as const,
    },
    {
      title: 'Cung cấp sách thiếu nhi và truyện tranh',
      supplierName: 'Nhà xuất bản Kim Đồng',
      type: 'Mua sách',
      value: 145_000_000,
      signedDate: daysFromNow(-180),
      expiryDate: daysFromNow(185),
      status: 'active' as const,
    },
    {
      title: 'Đặt mua báo và tạp chí định kỳ năm ' + year,
      supplierName: 'Công ty Phát hành Báo chí Trung ương',
      type: 'Báo - Tạp chí',
      value: 48_000_000,
      signedDate: daysFromNow(-260),
      expiryDate: daysFromNow(105),
      status: 'active' as const,
    },
    {
      title: 'Bảo trì hệ thống máy tính và mạng phòng đọc',
      supplierName: 'Công ty TNHH Dịch vụ Tin học FPT',
      type: 'Dịch vụ',
      value: 86_000_000,
      signedDate: daysFromNow(-330),
      expiryDate: daysFromNow(21),
      status: 'expiring' as const,
    },
    {
      title: 'Thuê phần mềm quản lý thư viện số',
      supplierName: 'Công ty CP Giải pháp VNIT',
      type: 'Phần mềm',
      value: 72_000_000,
      signedDate: daysFromNow(-350),
      expiryDate: daysFromNow(14),
      status: 'expiring' as const,
    },
    {
      title: 'Cung cấp giá kệ và bàn ghế phòng đọc tầng 2',
      supplierName: 'Công ty Nội thất Hòa Phát',
      type: 'Thiết bị',
      value: 210_000_000,
      signedDate: daysFromNow(-420),
      expiryDate: daysFromNow(-55),
      status: 'expired' as const,
    },
    {
      title: 'Số hóa tài liệu địa chí và luận văn',
      supplierName: 'Công ty CP Số hóa Tài liệu Đông Dương',
      type: 'Dịch vụ',
      value: 165_000_000,
      signedDate: daysFromNow(-500),
      expiryDate: daysFromNow(-140),
      status: 'expired' as const,
    },
    {
      title: 'Lắp đặt hệ thống cổng từ an ninh',
      supplierName: 'Công ty TNHH Thiết bị Thư viện Minh Long',
      type: 'Thiết bị',
      value: 98_000_000,
      signedDate: daysFromNow(-700),
      expiryDate: daysFromNow(-335),
      status: 'liquidated' as const,
    },
    {
      title: 'Vệ sinh và bảo quản kho sách',
      supplierName: 'Công ty Dịch vụ Vệ sinh Sạch Xanh',
      type: 'Dịch vụ',
      value: 36_000_000,
      signedDate: daysFromNow(-90),
      expiryDate: daysFromNow(275),
      status: 'active' as const,
    },
    {
      title: 'Cung cấp sách ngoại văn và từ điển chuyên ngành',
      supplierName: 'Công ty Xuất nhập khẩu Sách Xunhasaba',
      type: 'Mua sách',
      value: 128_000_000,
      signedDate: daysFromNow(-60),
      expiryDate: daysFromNow(305),
      status: 'active' as const,
    },
  ]

  await prisma.supplierContract.createMany({
    data: contracts.map((c, i) => ({ ...c, code: `HD-${year}-${String(i + 1).padStart(3, '0')}` })),
  })
}

async function seedReaders() {
  const people = [
    { fullName: 'Nguyễn Văn An', phone: '0901 234 567', expiry: 420, status: 'active' as const },
    { fullName: 'Trần Thị Bích Ngọc', phone: '0912 345 678', expiry: 260, status: 'active' as const },
    { fullName: 'Lê Minh Châu', phone: '0987 654 321', expiry: 95, status: 'active' as const },
    { fullName: 'Phạm Quốc Đạt', phone: '0977 111 222', expiry: 310, status: 'active' as const },
    { fullName: 'Hoàng Thị Mai Hương', phone: '0933 444 555', expiry: 150, status: 'active' as const },
    { fullName: 'Vũ Đình Khang', phone: '0966 777 888', expiry: 200, status: 'active' as const },
    { fullName: 'Đỗ Thị Thu Hà', phone: '0944 555 666', expiry: 45, status: 'active' as const },
    { fullName: 'Bùi Thanh Tùng', phone: '0922 333 444', expiry: 380, status: 'active' as const },
    { fullName: 'Ngô Thị Kim Chi', phone: '0955 666 777', expiry: 275, status: 'active' as const },
    { fullName: 'Đặng Hữu Phước', phone: '0988 222 333', expiry: 130, status: 'active' as const },
    { fullName: 'Lý Thị Hồng Nhung', phone: '0911 888 999', expiry: 60, status: 'active' as const },
    { fullName: 'Trịnh Văn Hiếu', phone: '0902 555 111', expiry: 340, status: 'active' as const },
    { fullName: 'Cao Thị Lệ Quyên', phone: '0935 121 212', expiry: -30, status: 'expired' as const },
    { fullName: 'Hoàng Văn Cường', phone: '0978 343 434', expiry: -85, status: 'expired' as const },
    { fullName: 'Phan Thị Diễm My', phone: '0968 565 656', expiry: 210, status: 'locked' as const },
  ]

  await prisma.reader.createMany({
    data: people.map((p, i) => ({
      code: `DG-${String(i + 1).padStart(5, '0')}`,
      fullName: p.fullName,
      email: `docgia${String(i + 1).padStart(2, '0')}@email.com`,
      phone: p.phone,
      cardExpiry: daysFromNow(p.expiry),
      status: p.status,
    })),
  })
}

async function seedBooks() {
  const titles = [
    { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', publisher: 'NXB Tổng hợp TP.HCM', category: 'Kỹ năng sống', quantity: 12 },
    { title: 'Nhà Giả Kim', author: 'Paulo Coelho', publisher: 'NXB Văn học', category: 'Văn học nước ngoài', quantity: 8 },
    { title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', publisher: 'NXB Tri thức', category: 'Lịch sử', quantity: 6 },
    { title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', category: 'Công nghệ thông tin', quantity: 5 },
    { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', publisher: 'NXB Hội Nhà văn', category: 'Kỹ năng sống', quantity: 10 },
    { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', publisher: 'NXB Kim Đồng', category: 'Thiếu nhi', quantity: 15 },
    { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', publisher: 'NXB Văn học', category: 'Văn học Việt Nam', quantity: 9 },
    { title: 'Giáo Trình Giải Tích 1', author: 'Nguyễn Đình Trí', publisher: 'NXB Giáo dục Việt Nam', category: 'Giáo trình', quantity: 20 },
    { title: 'Giáo Trình Vật Lý Đại Cương', author: 'Lương Duyên Bình', publisher: 'NXB Giáo dục Việt Nam', category: 'Giáo trình', quantity: 18 },
    { title: 'Cơ Sở Dữ Liệu', author: 'Nguyễn Kim Anh', publisher: 'NXB Đại học Quốc gia', category: 'Giáo trình', quantity: 14 },
    { title: 'Chí Phèo', author: 'Nam Cao', publisher: 'NXB Văn học', category: 'Văn học Việt Nam', quantity: 11 },
    { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', category: 'Văn học Việt Nam', quantity: 7 },
    { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', publisher: 'NXB Trẻ', category: 'Thiếu nhi', quantity: 9 },
    { title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', publisher: 'NXB Thế giới', category: 'Tâm lý học', quantity: 4 },
    { title: 'Lịch Sử Việt Nam Bằng Tranh', author: 'Trần Bạch Đằng', publisher: 'NXB Trẻ', category: 'Lịch sử', quantity: 13 },
    { title: 'Từ Điển Anh - Việt', author: 'Viện Ngôn ngữ học', publisher: 'NXB Từ điển Bách khoa', category: 'Từ điển', quantity: 6 },
    { title: 'Nguyên Lý Kế Toán', author: 'Võ Văn Nhị', publisher: 'NXB Kinh tế TP.HCM', category: 'Giáo trình', quantity: 16 },
    { title: 'Bí Mật Của May Mắn', author: 'Alex Rovira', publisher: 'NXB Tổng hợp TP.HCM', category: 'Kỹ năng sống', quantity: 5 },
    { title: 'Giáo Trình Toán Cao Cấp A1 (bản cũ)', author: 'Bộ Giáo dục và Đào tạo', publisher: 'NXB Giáo dục Việt Nam', category: 'Giáo trình', quantity: 0 },
    { title: 'Tin Học Văn Phòng 2010 (bản cũ)', author: 'Phạm Quang Huy', publisher: 'NXB Thống kê', category: 'Công nghệ thông tin', quantity: 0 },
  ]

  await prisma.book.createMany({
    data: titles.map((b, i) => ({
      code: `S-${String(i + 1).padStart(5, '0')}`,
      title: b.title,
      author: b.author,
      publisher: b.publisher,
      category: b.category,
      quantity: b.quantity,
      available: b.quantity,
      status: b.quantity === 0 ? ('liquidated' as const) : ('available' as const),
    })),
  })
}

async function seedLoans() {
  const readers = await prisma.reader.findMany({ where: { status: 'active' }, orderBy: { code: 'asc' } })
  const books = await prisma.book.findMany({ where: { status: 'available' }, orderBy: { code: 'asc' } })

  // [readerIndex, bookIndex, borrowedDaysAgo, loanDurationDays, returnedAfterDays|null]
  const plan: [number, number, number, number, number | null][] = [
    [0, 0, 5, 14, null],
    [1, 1, 9, 14, null],
    [2, 3, 2, 21, null],
    [3, 4, 12, 14, null],
    [4, 7, 20, 30, null],
    [5, 9, 1, 14, null],
    [6, 2, 25, 14, null],
    [7, 5, 30, 14, null],
    [8, 11, 18, 14, null],
    [9, 13, 40, 14, null],
    [0, 6, 60, 14, 12],
    [1, 8, 75, 21, 20],
    [2, 10, 50, 14, 9],
    [3, 12, 35, 14, 14],
    [4, 14, 28, 21, 18],
    [5, 15, 90, 14, 11],
    [10, 16, 15, 30, null],
    [11, 17, 45, 14, 13],
  ]

  let sequence = 0

  for (const [readerIdx, bookIdx, borrowedAgo, duration, returnedAfter] of plan) {
    const reader = readers[readerIdx % readers.length]
    const book = books[bookIdx % books.length]
    if (!reader || !book) continue

    sequence += 1
    const borrowDate = daysFromNow(-borrowedAgo)
    const dueDate = daysFromNow(-borrowedAgo + duration)
    const returnDate = returnedAfter === null ? null : daysFromNow(-borrowedAgo + returnedAfter)

    let status: 'borrowing' | 'returned' | 'overdue'
    if (returnDate) {
      status = 'returned'
    } else {
      status = dueDate < today ? 'overdue' : 'borrowing'
    }

    await prisma.loanSlip.create({
      data: {
        code: `PM-${String(sequence).padStart(6, '0')}`,
        readerId: reader.id,
        bookId: book.id,
        borrowDate,
        dueDate,
        returnDate,
        status,
      },
    })

    // Sách chưa trả thì vẫn đang nằm ở ngoài, trừ vào số lượng còn lại
    if (status !== 'returned') {
      const current = await prisma.book.findUnique({ where: { id: book.id } })
      if (current && current.available > 0) {
        const available = current.available - 1
        await prisma.book.update({
          where: { id: book.id },
          data: { available, status: available === 0 ? 'borrowed_out' : current.status },
        })
      }
    }
  }
}

async function main() {
  await prisma.loanSlip.deleteMany()
  await prisma.book.deleteMany()
  await prisma.reader.deleteMany()
  await prisma.supplierContract.deleteMany()
  await prisma.systemUser.deleteMany()

  await seedUsers()
  await seedContracts()
  await seedReaders()
  await seedBooks()
  await seedLoans()

  const [users, contracts, readers, books, loans] = await Promise.all([
    prisma.systemUser.count(),
    prisma.supplierContract.count(),
    prisma.reader.count(),
    prisma.book.count(),
    prisma.loanSlip.count(),
  ])

  console.log('Đã tạo dữ liệu mẫu:')
  console.log(`  - ${users} tài khoản hệ thống (admin/admin, 2 thủ thư)`)
  console.log(`  - ${contracts} hợp đồng nhà cung cấp`)
  console.log(`  - ${readers} hồ sơ độc giả`)
  console.log(`  - ${books} đầu sách`)
  console.log(`  - ${loans} phiếu mượn/trả`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
