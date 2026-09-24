import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10)
  const adminPasswordHash = await bcrypt.hash('admin', 10)

  await prisma.systemUser.upsert({
    where: { email: 'admin' },
    update: { passwordHash: adminPasswordHash, role: 'admin', active: true },
    create: {
      fullName: 'Quản trị viên',
      email: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  })

  await prisma.systemUser.upsert({
    where: { email: 'hoa.pham@thuvien.edu.vn' },
    update: {},
    create: {
      fullName: 'Phạm Thị Hoa',
      email: 'hoa.pham@thuvien.edu.vn',
      passwordHash,
      role: 'admin',
    },
  })

  await prisma.systemUser.upsert({
    where: { email: 'long.nguyen@thuvien.edu.vn' },
    update: {},
    create: {
      fullName: 'Nguyễn Văn Long',
      email: 'long.nguyen@thuvien.edu.vn',
      passwordHash,
      role: 'librarian',
    },
  })

  await prisma.supplierContract.upsert({
    where: { code: 'HD-2026-001' },
    update: {},
    create: {
      code: 'HD-2026-001',
      title: 'Cung cấp sách khoa học 2026',
      supplierName: 'NXB Kim Đồng',
      type: 'Mua sách',
      value: 250000000,
      signedDate: new Date('2026-01-10'),
      expiryDate: new Date('2026-12-31'),
      status: 'active',
    },
  })

  await prisma.supplierContract.upsert({
    where: { code: 'HD-2025-045' },
    update: {},
    create: {
      code: 'HD-2025-045',
      title: 'Bảo trì hệ thống máy tính thư viện',
      supplierName: 'Công ty TNHH FPT Services',
      type: 'Dịch vụ',
      value: 80000000,
      signedDate: new Date('2025-03-01'),
      expiryDate: new Date('2026-10-05'),
      status: 'expiring',
    },
  })

  const reader = await prisma.reader.upsert({
    where: { code: 'DG-1001' },
    update: {},
    create: {
      code: 'DG-1001',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0901 234 567',
      cardExpiry: new Date('2027-03-15'),
      status: 'active',
    },
  })

  const book = await prisma.book.upsert({
    where: { code: 'S-00231' },
    update: {},
    create: {
      code: 'S-00231',
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      publisher: 'NXB Tổng hợp TP.HCM',
      category: 'Kỹ năng sống',
      quantity: 10,
      available: 9,
      status: 'available',
    },
  })

  await prisma.loanSlip.upsert({
    where: { code: 'PM-000231' },
    update: {},
    create: {
      code: 'PM-000231',
      readerId: reader.id,
      bookId: book.id,
      borrowDate: new Date('2026-09-10'),
      dueDate: new Date('2026-09-24'),
      status: 'borrowing',
    },
  })

  console.log('Đã tạo dữ liệu mẫu. Tài khoản đăng nhập: hoa.pham@thuvien.edu.vn / 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
